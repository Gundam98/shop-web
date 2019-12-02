function judgeStatus(goodsData) {
    switch (goodsData.status) {
        case 0:
            {
                return "待重新上架";
            }
        case 1:
            {
                if (goodsData.isBidMode === "true") {
                    if (goodsData.overTime <= new Date().getTime()) {
                        //竞拍结束
                        if (goodsData.currentBuyerUserId !== null) {
                            //有人出价，等待卖家接受竞价
                            return "待接受竞价";
                        } else {
                            //无人出价，卖家可以修改信息
                            return "待重新上架";
                        }
                    } else {
                        //在竞拍时间内
                        if (goodsData.currentBuyerUserId !== null) {
                            //有人出价，等待卖家接受竞价
                            return "竞价中";
                        } else {
                            //无人出价，卖家可以修改信息
                            return "待竞价";
                        }
                    }
                } else {
                    return "待出售";
                }
            }
        case 2:
            {
                return "已成交";
            }
    }
}

export default judgeStatus;