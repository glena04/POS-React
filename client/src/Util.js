
    export const calculate = (tempCart) => {
        let tempPreTax = 0;
        for (let i = 0; i < tempCart.length; i++) {
            tempPreTax = tempPreTax + (tempCart[i].price * tempCart[i].quantity);
        }
        
        return tempPreTax
    }

    