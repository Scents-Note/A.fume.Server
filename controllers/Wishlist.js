'use strict';

const Wishlist = require('../service/WishlistService');
const { OK, INTERNAL_SERVER_ERROR } = require('../utils/statusCode.js');

module.exports.createWishlist = (req, res, next) => {
    const { perfumeIdx, priority } = req.body;
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    Wishlist.createWishlist(perfumeIdx, loginUserIdx, priority)
        .then(() => {
            res.status(OK).json({
                message: '위시 리스트에 성공적으로 추가했습니다.',
            });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports.updateWishlist = (req, res, next) => {
    const { perfumeIdx, priority } = req.swagger.params['body'].value;
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    Wishlist.updateWishlist(perfumeIdx, loginUserIdx, priority)
        .then(() => {
            res.status(OK).json({
                message: '위시 리스트에 성공적으로 수정했습니다.',
            });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports.deleteWishlist = (req, res, next) => {
    const perfumeIdx = req.swagger.params['perfumeIdx'].value;
    const loginUserIdx = req.middlewareToken.loginUserIdx || -1;
    Wishlist.deleteWishlist(perfumeIdx, loginUserIdx)
        .then(() => {
            res.status(OK).json({
                message: '위시 리스트에 성공적으로 삭제했습니다.',
            });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports.readWishlistByUser = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx || -1;
    Wishlist.readWishlistByUser(loginUserIdx)
        .then((response) => {
            res.status(OK).json({
                message: '유저가 가지고 있는 위시 리스트 조회',
                data: response,
            });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports.deleteWishlistByUser = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx || -1;
    Wishlist.deleteWishlistByUser(loginUserIdx)
        .then((response) => {
            res.status(OK).json({
                message: '유저가 가지고 있는 위시 리스트 삭제했습니다',
                data: response,
            });
        })
        .catch((err) => {
            next(err);
        });
};
