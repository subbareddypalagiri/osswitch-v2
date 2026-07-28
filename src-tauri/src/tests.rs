#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_regex_guard() {
        let is_safe = super::engine::run_command_secure("echo hello");
        assert!(is_safe.is_ok());

        let is_dangerous = super::engine::run_command_secure("format C:");
        assert!(is_dangerous.is_err());
    }

    #[test]
    fn test_os_catalog_parity() {
        let catalog = super::engine::get_os_catalog();
        assert_eq!(catalog.len(), 40, "OS Catalog must have exactly 40 Operating Systems to match V1.");
    }
}
