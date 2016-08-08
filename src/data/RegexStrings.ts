export const RG_JAVA = "(/\\*([^*]|[\\r\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+/)|(//.*)";
export const RG_PYTHON = "#\\s*(.+)";
export const RG_ADA = "--\\s*(.+)";
export const RG_FSHARP = "(\\(\\*([^*]|[\\r\\n]|(\\*+([^*\\)]|[\\r\\n])))*\\*+\\))|(//.*)";
// For CSS, only /*..*/ is available and not allow nested comment
export const RG_CSS = "/\\*([^*]*\\*+(?:[^/*][^*]*\\*+)*)/";
export const RG_LATEX = "%\\s*(.+)";