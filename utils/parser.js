module.exports.parseSortToOrder = (sort) => {
    let order = [];
    if (sort) {
        let [key, ascending] = sort.split('_');
        ascending = ascending || 'desc';
        switch (ascending) {
            case 'desc':
            case 'dsc':
                ascending = 'DESC';
                break;
            case 'asc':
            default:
                ascending = 'ASC';
                break;
        }
        order.push([key, ascending]);
    }
    return order;
};
