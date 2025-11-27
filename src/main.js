import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

const api = initData(sourceData);

const applySearching = initSearching("search");

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let query = {}; // здесь будут формироваться параметры запроса

    // Применяем обработчики
    query = applySearching(query, state, action);
    
    // Применяем фильтрацию
    query = applyFiltering(query, state, action);
    
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    // Применяем поиск
    query = applySearching(query, state, action);

    // Применяем сортировку 
    query = applySorting(query, state, action);

    // Запрашиваем данные с собранными параметрами
    const { total, items } = await api.getRecords(query);

    // Перерисовываем пагинатор после получения данных
    updatePagination(total, query);

    // Рендерим таблицу
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['header', 'filter'],
    after: ['pagination']
}, render);

// Инициализация
let applyFiltering;
let updateIndexes;
let applySorting;
let applyPagination;
let updatePagination;

async function init() {
    const indexes = await api.getIndexes();

    // Обновляем инициализацию фильтрации — получаем две функции
    ({ applyFiltering, updateIndexes }) = initFiltering(
        sampleTable.filter.elements,
        {
            searchBySeller: indexes.sellers
        }
    );

    applySorting = initSorting([
        sampleTable.header.elements.sortByDate,
        sampleTable.header.elements.sortByTotal
    ]);

    ({ applyPagination, updatePagination }) = initPagination(
        sampleTable.pagination.elements,
        (el, page, isCurrent) => {
            const input = el.querySelector('input');
            const label = el.querySelector('span');
            input.value = page;
            input.checked = isCurrent;
            label.textContent = page;
            return el;
        }
    );

    // Обновляем индексы в интерфейсе
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

init().then(render);
