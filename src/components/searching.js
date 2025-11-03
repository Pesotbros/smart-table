import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison([
        rules.skipEmptyTargetValues,                              // пропускаем пустые значения
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)  
        // ищем в нескольких полях (дата, покупатель, продавец)
    ]);

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        return data.filter(row => compare(row, state));
    }
}
