module.exports = {
    getAll: () => {
        return [{
            id: 0,
            name: 'dummy name1'
        }, {
            id: 1,
            name: 'dummy name2'
        }, {
            id: 2,
            name: 'dummy name3'
        }];
    },
    getById: (id) => {
        return {
            id: id,
            name: 'dummy name1'
        };
    },
    insert: () => {
        return true;
    },
    update: () => {
        return true;
    },
    remove: () => {
        return true;
    }
}