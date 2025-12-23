import Iyzipay from 'iyzipay'

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY || "sandbox-api-key",
    secretKey: process.env.IYZICO_SECRET_KEY || "sandbox-secret-key",
    uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com"
})

export default iyzipay

export function initializePayment(data: {
    price: number,
    paidPrice: number,
    basketId: string,
    paymentGroup?: string,
    callbackUrl: string,
    buyer: {
        id: string,
        name: string,
        surname: string,
        email: string,
        identityNumber: string,
        ip: string,
        city: string,
        country: string,
        zipCode?: string,
        address: string
    },
    items: {
        id: string,
        name: string,
        category: string,
        price: number
    }[]
}) {
    return new Promise((resolve, reject) => {
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: data.basketId,
            price: data.price.toString(),
            paidPrice: data.paidPrice.toString(),
            currency: Iyzipay.CURRENCY.TRY,
            basketId: data.basketId,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: data.callbackUrl,
            enabledInstallments: [2, 3, 6, 9],
            buyer: {
                id: data.buyer.id,
                name: data.buyer.name,
                surname: data.buyer.surname,
                gsmNumber: "+905350000000",
                email: data.buyer.email,
                identityNumber: data.buyer.identityNumber,
                lastLoginDate: "2015-10-05 12:43:35",
                registrationDate: "2013-04-21 15:12:09",
                registrationAddress: data.buyer.address,
                ip: data.buyer.ip,
                city: "Istanbul",
                country: "Turkey",
                zipCode: "34732"
            },
            shippingAddress: {
                contactName: data.buyer.name + " " + data.buyer.surname,
                city: "Istanbul",
                country: "Turkey",
                address: data.buyer.address,
                zipCode: "34732"
            },
            billingAddress: {
                contactName: data.buyer.name + " " + data.buyer.surname,
                city: "Istanbul",
                country: "Turkey",
                address: data.buyer.address,
                zipCode: "34732"
            },
            basketItems: data.items.map(item => ({
                id: item.id,
                name: item.name,
                category1: item.category,
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: item.price.toString()
            }))
        };

        iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

export function retrievePaymentResult(token: string) {
    return new Promise((resolve, reject) => {
        iyzipay.checkoutForm.retrieve({
            token: token
        }, (err: any, result: any) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
