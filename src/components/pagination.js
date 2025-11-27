import { getPages } from "../lib/utils.js";

let pageCount; // Временная переменная для хранения количества страниц

const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // Обрабатываем действия (аналог @todo: #2.6)
    if (action) {
        switch (action.name) {
            case 'prev':
                page = Math.max(1, page - 1);
                break;
            case 'next':
                page = Math.min(pageCount, page + 1);
                break;
            case 'first':
                page = 1;
                break;
            case 'last':
                page = pageCount;
                break;
        }
    }

    return Object.assign({}, query, {
        limit,
        page
    });
};

const updatePagination = (total, { page, limit }, pages, fromRow, toRow, totalRows, createPage) => {
    // Считаем общее количество страниц (аналог @todo: #2.1)
    pageCount = Math.ceil(total / limit);

    // Получаем список видимых страниц и выводим их (аналог @todo: #2.4)
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(...visiblePages.map(pageNumber => {
        const el = pages.firstElementChild.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
    }));

    // Обновляем статус пагинации (аналог @todo: #2.5)
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
};

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    // Подготавливаем шаблон кнопки для страницы и очищаем контейнер (аналог @todo: #2.3)
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    return {
        updatePagination: (total, paginationState) => 
            updatePagination(total, paginationState, pages, fromRow, toRow, totalRows, createPage),
        applyPagination: (query, state, action) =>
            applyPagination(query, state, action)
    };
};

    
