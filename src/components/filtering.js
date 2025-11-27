export function initFiltering(elements) {
    /**
     * Заполняет select-элементы опциями на основе переданных индексов.
     * @param {Object} elements — объект с DOM-элементами форм (ключи — имена элементов).
     * @param {Object} indexes — объект с данными для заполнения (ключи — имена элементов, значения — массивы имён опций).
     */
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            // Проверяем, существует ли элемент в переданной коллекции
            if (elements[elementName]) {
                // Создаём массив option-элементов из значений индекса
                const options = Object.values(indexes[elementName]).map(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    return el;
                });
                // Добавляем все опции в соответствующий select
                elements[elementName].append(...options);
            }
        });
    };

    /**
     * Применяет фильтрацию на основе значений полей формы.
     * Собирает непустые значения из INPUT и SELECT, формирует фильтр и объединяет его с исходным запросом.
     * @param {Object} query — исходный объект запроса (будет дополнен фильтрами).
     * @param {Object} state — текущее состояние (не используется в данной реализации).
     * @param {Object} action — действие (не используется в данной реализации).
     * @returns {Object} — обновлённый запрос с применёнными фильтрами.
     */
    const applyFiltering = (query, state, action) => {
        const filter = {};

        // Проходим по всем элементам формы
        Object.keys(elements).forEach((key) => {
            const element = elements[key];

            // Проверяем, что элемент существует и является INPUT или SELECT
            if (element && ['INPUT', 'SELECT'].includes(element.tagName)) {
                // Если значение элемента не пустое, добавляем его в фильтр
                if (element.value) {
                    filter[`filter[${element.name}]`] = element.value;
                }
            }
        });

        // Если в фильтре есть поля, объединяем его с исходным запросом
        return Object.keys(filter).length
            ? Object.assign({}, query, filter)
            : query;
    };

    // Возвращаем обе функции как API модуля
    return {
        updateIndexes,
        applyFiltering
    };
}
