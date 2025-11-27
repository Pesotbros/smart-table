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

// Инициализируем API для работы с данными
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
    let state = collectState();
    let query = {}; // Заменяем let result = [...data] на let query = {}

    // Применяем все обработчики
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    // Получаем актуальные данные через API
    const { total, items } = await api.getRecords(query);

    // Передаём items в render вместо result
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
let applySorting;
let applyPagination;

// Асинхронная функция инициализации
async function init() {
    // Получаем индексы через API
    const indexes = await api.getIndexes();

    applyFiltering = initFiltering(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });

    applySorting = initSorting([
        sampleTable.header.elements.sortByDate,
        sampleTable.header.elements.sortByTotal
    ]);

    applyPagination = initPagination(
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
}

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Заменяем прямой вызов render на init().then(render)
init().then(render);
