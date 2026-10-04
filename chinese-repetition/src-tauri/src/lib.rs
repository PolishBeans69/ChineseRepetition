// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod db;
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_items(app: tauri::AppHandle) -> Vec<(i64, String, String, String, i64)> {
    db::get_items(&app).unwrap_or_default()
}
#[tauri::command]
fn get_item(app: tauri::AppHandle) -> Result<(i64, String, String, String, i64), String> {
    db::get_item(&app).map_err(|e| e.to_string())
}
#[tauri::command]
fn add_item(app: tauri::AppHandle, chinese: &str, english: &str) -> Result<(), String> {
    db::add_item(&app, chinese, english).map_err(|e| e.to_string())
}
#[tauri::command]
fn delete_item(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    db::delete_item(&app, id).map_err(|e| e.to_string())
}
#[tauri::command]
fn update_count(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    db::update_count(&app, id).map_err(|e| e.to_string())
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            db::init(app.handle()).expect("failed to initialize database");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_items,
            get_item,
            add_item,
            delete_item,
            update_count,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
