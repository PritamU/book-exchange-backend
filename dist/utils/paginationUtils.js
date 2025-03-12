"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSortHandler = exports.getHasNext = void 0;
const paginationSortHandler = (page, limit, sortField, sortValue) => {
    //pagination handler
    if (!page)
        page = 1;
    if (!limit)
        limit = 10;
    let skip = (page - 1) * limit;
    //sort handler
    let sortArray = [];
    if (sortField && sortValue) {
        sortArray = [[sortField, sortValue]];
    }
    return { skip, sortArray, limit, page };
};
exports.paginationSortHandler = paginationSortHandler;
const getHasNext = (page, limit, count) => {
    return page * limit < count;
};
exports.getHasNext = getHasNext;
