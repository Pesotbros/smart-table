import { makeIndex } from "./lib/utils.js";

export function initData(sourceData) {
    // Создаём индексы продавцов и покупателей
    const sellers = makeIndex(sourceData.sellers, 'id', v => `${v.first_name} ${v.last_name}`);
    const customers = makeIndex(sourceData.customers, 'id', v => `${v.first_name} ${v.last_name}`);

    // Преобразуем записи покупок
    const data = sourceData.purchase_records.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    // Определяем асинхронные функции для получения данных
    const getIndexes = async () => {
        return { sellers, customers };
    };

    const getRecords = async () => {
        return {
            total: data.length,
            items: data
        };
    };

    // Возвращаем объект с двумя функциями
    return {
        getIndexes,
        getRecords
    };
}
