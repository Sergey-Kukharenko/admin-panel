// Живёт в entities/dataset (а не в виджете таблицы), чтобы feature загрузки файлов
// тоже могла инвалидировать этот запрос, не нарушая направление зависимостей FSD.
export const DATASET_HISTORY_QUERY_KEY = 'dataset-history';
