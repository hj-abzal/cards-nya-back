import {Request, Response} from "express";
import User, {IUser} from "../../f-1-auth/a-2-models/user";
import {status500} from "../../f-1-auth/a-3-helpers/h-2-more/errorStatuses";
import {resCookie} from "../../../cnb-1-main/cookie";

export const getUsers = async (req: Request, res: Response, user: IUser) => {
    const {page, pageCount, sortUsers, userName, min, max, block} = req.query;
    const findF: any = {
        isDeleted: {$ne: true}
    }
    if (!block) {
        findF.isBlocked = {$ne: true}
    }

    let pageF = page && +page || 1;
    const pageCountF = pageCount && +pageCount || 4;
    const sortUsersF: string = sortUsers as string | undefined || ''; // '0grade'
    const userNameF: string = userName as string | undefined || '';

    User.findOne(findF)
        .sort({publicCardPacksCount: 1})
        .exec()
        .then((userMin: IUser | null) => {
            const minF = userMin ? userMin.publicCardPacksCount : 0;

            User.findOne(findF)
                .sort({publicCardPacksCount: -1}).exec()
                .then((userMax: IUser | null) => {
                    const maxF = userMax ? userMax.publicCardPacksCount : minF;

                    const sortName: any = sortUsersF && sortUsersF.length > 2 ? sortUsersF.slice(1) : 'updated';
                    const direction = sortName ? (sortUsersF[0] === '0' ? -1 : 1) : -1;

                    const findBase = {
                        name: new RegExp(userNameF as string, 'gi'),
                        publicCardPacksCount: {$gte: min && +min || minF, $lte: max && +max || maxF},
                        ...findF,
                    };

                    User.find(findBase)
                        .sort({[sortName]: direction})
                        .skip(pageCountF * (pageF - 1))
                        .limit(pageCountF)
                        .lean()
                        .select('_id email isAdmin name verified avatar publicCardPacksCount created updated')
                        .exec()
                        .then(users => {

                            User.count(findBase)
                                .exec()
                                .then(usersTotalCount => {
                                    if (pageCountF * (pageF - 1) > usersTotalCount) pageF = 1;

                                    resCookie(res, user).status(200)
                                        .json({
                                            users,
                                            page: pageF, pageCount: pageCountF, usersTotalCount,
                                            minPublicCardPacksCount: minF, maxPublicCardPacksCount: maxF,
                                            token: user.token,
                                            tokenDeathTime: user.tokenDeathTime,
                                        })
                                })
                                .catch(e => status500(res, e, user, 'getUsers/User.count'))
                        })
                        .catch(e => status500(res, e, user, 'getUsers/User.find'))
                })
                .catch(e => status500(res, e, user, 'getUsers/User.findOne/max'))
        })
        .catch(e => status500(res, e, user, 'getUsers/User.findOne/min'))
};

// ?????? ????????????????
// $eq ?????????????????????????? ??????????????????, ?????????????? ?????????? ???????????????????? ????????????????.
// $gt ?????????????????????????? ??????????????????, ?????????????? ???????????? ???????????????????? ????????????????.
// $gte ?????????????????????????? ??????????????????, ?????????????? ???????????? ?????? ?????????? ???????????????????? ????????????????.
// $in ?????????????????????????? ???????????? ???? ????????????????, ?????????????????? ?? ??????????????.
// $lt ?????????????????????????? ??????????????????, ?????????????? ???????????? ???????????????????? ????????????????.
// $lte ?????????????????????????? ??????????????????, ?????????????? ???????????? ?????? ?????????? ???????????????????? ????????????????.
// $ne ?????????????????????????? ???????? ??????????????????, ?????????????? ???? ?????????? ???????????????????? ????????????????.
// $nin ???? ?????????????????????????? ???? ???????????? ???? ????????????????, ?????????????????? ?? ??????????????.

// $and ???????????????????? ?????????????????????? ?????????????? ?? ???????????????????? ?? ???????????????????? ?????? ??????????????????, ?????????????? ?????????????????????????? ???????????????? ?????????? ??????????????????????.
// $not ?????????????????????? ???????????? ?????????????????? ?????????????? ?? ???????????????????? ??????????????????, ?????????????? ???? ?????????????????????????? ?????????????????? ??????????????.
// $nor ???????????????????? ?????????????????????? ?????????????? ?? ???????????????????? NOR ?? ???????????????????? ?????? ??????????????????, ?????????????? ???? ?????????????????????????? ?????????? ????????????????????????.
// $or ???????????????????? ?????????????????????? ?????????????? ?? ???????????????????? ?????? ???????????????????? ?????? ??????????????????, ?????????????? ?????????????????????????? ???????????????? ???????????? ???? ??????????????????????.

// $exists ?????????????????????????? ???????????????????? ?? ?????????????????? ??????????.
// $type ???????????????? ??????????????????, ???????? ???????? ?????????? ?????????????????? ??????.

// $expr ?????????????????? ???????????????????????? ?????????????????? ?????????????????? ???? ?????????? ????????????????.
// $jsonSchema ?????????????????? ?????????????????? ???? ???????????????????????? ???????????? JSON-??????????.
// $mod ?????????????????? ???????????????? ???? ???????????? ?????? ?????????????????? ???????? ?? ???????????????? ?????????????????? ?? ?????????????????? ??????????????????????.
// $regex ???????????????? ??????????????????, ???????????????? ?????????????? ?????????????????????????? ?????????????????? ?????????????????????? ??????????????????.
// $text ?????????????????? ?????????????????? ??????????.
// $where ?????????????????????????? ????????????????????, ?????????????? ?????????????????????????? ?????????????????? JavaScript.
