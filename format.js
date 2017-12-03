

function maxWidth(data, colNames){
    widths = {};

    for(i in colNames){
        var maxWidth = 0;
        for(k in data){
            if(data[k][colNames[i]].toString().length > maxWidth){
                maxWidth = data[k][colNames[i]].toString().length;
                widths[colNames[i]] = maxWidth
            }
        }
    }
    return widths;
}

function centerInCol(text, colWidth){
    colWidth += 4;
    let diff = colWidth - text.length;

    var fspace = diff % 2 === 0 ? " ".repeat(Math.floor(diff / 2)) : " ".repeat(Math.floor(diff / 2) + 1);
    var bspace = " ".repeat(Math.floor(diff / 2));

     return "|" + fspace + text + bspace + "|"
}

function formatPrice(price){
    price = price.toString();
    if(price.indexOf(".") !== -1){
        if(price.split(".")[1].length < 2){
            price += "0";
        }
    }
    else{
        price += ".00"
    }
    return price
}

module.exports = {
    maxWidth: maxWidth,
    centerInCol: centerInCol,
    formatPrice: formatPrice
}