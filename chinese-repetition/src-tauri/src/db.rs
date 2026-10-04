use pinyin::ToPinyin;
use rusqlite::{Connection, Result};
use std::string::String;
use tauri::Manager;

fn get_connection(app: &tauri::AppHandle) -> Result<Connection> {
    let app_data = app
        .path()
        .app_data_dir()
        .map_err(|e| rusqlite::Error::InvalidPath(e.to_string().into()))?;

    std::fs::create_dir_all(&app_data)
        .map_err(|_| rusqlite::Error::InvalidPath(app_data.clone()))?;

    let db_path = app_data.join("app.db");

    Connection::open(db_path)
}

pub fn init(app: &tauri::AppHandle) -> Result<()> {
    let conn = get_connection(app)?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chinese TEXT NOT NULL UNIQUE,
            pinyin TEXT NOT NULL,
            english TEXT NOT NULL,
            count INTEGER NOT NULL DEFAULT 0
        )",
        [],
    )?;
    Ok(())
}
pub fn add_item(app: &tauri::AppHandle, chinese: &str, english: &str) -> Result<()> {
    let word = format!("{}", chinese);
    let mut pinyin = String::new();
    for char in word.as_str().to_pinyin().flatten() {
        pinyin.push_str(char.plain());
    }
    let conn = get_connection(app)?;

    conn.execute(
        "INSERT INTO words (chinese, pinyin, english, count) VALUES (?, ?, ?, ?)
         ON CONFLICT(chinese) DO UPDATE SET english = excluded.english, pinyin = excluded.pinyin",
        (chinese, pinyin, english, 0),
    )?;

    Ok(())
}
pub fn get_items(app: &tauri::AppHandle) -> Result<Vec<(i64, String, String, String, i64)>> {
    let conn = get_connection(app)?;

    let mut stmt =
        conn.prepare("SELECT id, chinese, pinyin, english, count FROM words ORDER BY count DESC")?;

    let rows = stmt.query_map([], |row| {
        Ok((
            row.get(0)?,
            row.get(1)?,
            row.get(2)?,
            row.get(3)?,
            row.get(4)?,
        ))
    })?;

    rows.collect()
}
pub fn get_item(app: &tauri::AppHandle) -> Result<(i64, String, String, String, i64)> {
    let conn = get_connection(app)?;
    let mut stmt = conn.prepare(
        "SELECT id, chinese, pinyin, english, count FROM words WHERE count = (SELECT MIN(count) FROM words) ORDER BY RANDOM() LIMIT 1",
    )?;
    let row = stmt.query_row([], |row| {
        Ok((
            row.get(0)?,
            row.get(1)?,
            row.get(2)?,
            row.get(3)?,
            row.get(4)?,
        ))
    })?;
    Ok(row)
}

pub fn delete_item(app: &tauri::AppHandle, id: i64) -> Result<()> {
    let conn = get_connection(app)?;

    conn.execute("DELETE FROM words WHERE id = ?", [id])?;

    Ok(())
}

pub fn update_count(app: &tauri::AppHandle, id: i64) -> Result<()> {
    let conn = get_connection(app)?;

    conn.execute("UPDATE words SET count = count + 1 WHERE id = ?", [id])?;

    Ok(())
}
