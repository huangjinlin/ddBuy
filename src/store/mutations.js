// 引入mutation-type
import {
    ADD_GOODS,
    INIT_SHOP_CART,
    REDUCE_GOODS,
    SINGLE_SELECT_GOODS,
    ALL_SELECT_GOODS,
    DELETE_SELECT_GOODS,
    USER_INFO,
    INIT_USER_INFO
} from './mutation-type'
import Vue from 'vue'

// 引入本地存储
import {
    getLocalStore,
    setLocalStore
} from '../config/global'

export default {
    // 注意:外界传值的参数一定要和定义的参数一致  goodsID  isCheckedAll
    // 1.添加商品
    [ADD_GOODS](state, {
        goodsID,
        goodsName,
        smallImage,
        goodsPrice
    }) {
        let shopCart = state.shopCart;
        // 1.1 判断商品是否存在
        if (shopCart[goodsID]) {
            // 让数量goodsID里面的num +1
            shopCart[goodsID]['num']++;

        } else {
            // 1.2 不存在则设置默认值
            shopCart[goodsID] = {
                'num': 1,
                'id': goodsID,
                'name': goodsName,
                'price': goodsPrice,
                'smallImage': smallImage,
                'checked': true
            }
            // 1.3 给shopCart产生新对象
            state.shopCart = {
                ...shopCart
            };
            // 1.4 将数据存储到本地
            setLocalStore('shopCart', state.shopCart);
        }
    },
    // 2.页面初始化,获取本地购物车的数据
    [INIT_SHOP_CART](state) {
        // 2.1 先存本地取购物车数据
        let initShopCart = getLocalStore('shopCart');
        if (initShopCart) {
            // 2.1 如何购物车有数据那么就把它通过对象的方式赋值给store
            state.shopCart = JSON.parse(initShopCart);
        }
    },
    // 3.减少商品
    [REDUCE_GOODS](state, {
        goodsID
    }) {
        // 3.1 取出state中的商品数据
        let shopCart = state.shopCart;
        // 3.2 通过商品ID来找到这个商品
        let goods = shopCart[goodsID];
        if (goods) {
            // 3.3 找到该商品做处理
            if (goods['num'] > 0) {
                // 3.4 减少商品数量
                goods['num']--;
            }
            // 3.4 如果num的数量为0,那么就移除
            if (goods['num'] === 0) {
                delete shopCart[goodsID];
            }
            // 3.5 同步state中的数据
            state.shopCart = {
                ...shopCart
            };
            // 3.6 同步本地数据
            setLocalStore('shopCart', state.shopCart);
        }
    },
    // 4.单个商品选中
    [SINGLE_SELECT_GOODS](state, {
        goodsID
    }) {
        // 4.1 取出state中的商品数据
        let shopCart = state.shopCart;
        // 4.2 根据商品id取到goods
        let goods = shopCart[goodsID];
        // 4.3 判断商品是否存在
        if (goods) {
            // 4.4 判断checked是否存在
            if (goods.checked) {
                // 4.5 取反
                goods.checked = !goods.checked;
            } else {
                // 4.6 不存在那么就设置默认值
                Vue.set(goods, 'checked', true);
            }
        }
        // 4.4 将数据同步到state中
        state.shopCart = {
            ...shopCart
        };
        // 4.5 将数据更新到本地
        setLocalStore('shopCart', state.shopCart);
    },
    // 5.全选商品 外界出过来一个isSelected
    [ALL_SELECT_GOODS](state, {
        isCheckedAll
    }) {
        // 5.1 取出state中的商品数据
        let shopCart = state.shopCart;
        Object.values(shopCart).forEach((goods, index) => {
            if (goods.checked) { // 存在该属性
                goods.checked = !isCheckedAll;
            } else {
                Vue.set(goods, 'checked', !isCheckedAll);
            }
        });
        // 5.2 同步state数据
        state.shopCart = {
            ...shopCart
        };
        // 5.3 将数据更新到本地
        setLocalStore('shopCart', state.shopCart);
    },
    // 6.删除选中商品
    [DELETE_SELECT_GOODS](state) {
        // 6.1 取出state中的商品数据
        let shopCart = state.shopCart;
        Object.values(shopCart).forEach((goods, index) => {
            if (goods.checked) {
                // 6.2删除选中商品
                delete shopCart[goods.id];
            }
        });
        // 6.3 更新state数据
        state.shopCart = {
            ...shopCart
        }
        // 6.4 更新本地数据
        setLocalStore('shopCart', state.shopCart);
    },

    // 7.保存用户信息到本地
    [USER_INFO](state, {
        userInfo
    }) {
        // 7.1 把外界传来的userInfo保存到state中的userInfo
        state.userInfo = userInfo;
        // 7.2 保存到本地缓存中
        setLocalStore('userInfo', state.userInfo);
    },

    // 8.获取用户信息
    [INIT_USER_INFO](state) {
        // 8.1 从本地获取用户信息
        let userInfo = getLocalStore('userInfo')
        // 8.2 如果存在则把用户信息保存到state中
        if (userInfo) {
            state.userInfo = JSON.parse(userInfo);
        }
    }
}