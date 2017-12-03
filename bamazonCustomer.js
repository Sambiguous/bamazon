var inq = require("inquirer");
var format = require("./format");
var mysql = require("mysql");
var art = require("./art");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "PO)(IU*&po09iu87",
    database: "bamazon"
});

art.title();

connection.connect(function(err){
    if(err){
        console.log("error: " + err.message);
    } 
    showAll();
});



function showAll(){
    connection.query("select * from products;", function(err, res){
        if(err) throw err;

        var widths = format.maxWidth(res, ["price", "product_name"])
        
        let col_id = format.centerInCol("ID", 4)
        let col_name = format.centerInCol("Product Name", widths.product_name)
        let col_price = format.centerInCol("Price", widths.price);

        console.log(col_id + "\b" + col_name + "\b" + col_price)
        console.log("");

        for(i in res){
            let id = format.centerInCol(res[i].item_id.toString(), 4)
            let name = format.centerInCol(res[i].product_name, widths.product_name);
            let price = format.centerInCol(format.formatPrice(res[i].price), widths.price);

            console.log(id + "\b" + name + "\b" + price)
        }
        
        inq.prompt([
            {
                type: "input",
                message: "Enter the Id number of the item you wish to purchase:",
                name: "id"
            },{
                type: "input",
                message: "How many?",
                name: "quantity"
            }
        ]).then(function(data){
            buyItem(data.id, data.quantity, res)
        })

    });// end query

};// end function

function buyItem(item_id, quantity, table){
    let sql = "select product_name, stock_quantity from products where item_id = ?"
    connection.query(sql, item_id, function(err, res, flds){
        if(err) throw err;

        var quantityToBuy = parseInt(quantity);
        var stock = res[0].stock_quantity;

        if(stock > quantityToBuy){

            var item;
            var price;

            for(i in table){
                if(table[i].item_id.toString() === item_id){
                    item = table[i].product_name
                    price = format.formatPrice(table[i].price * quantity)
                }
            };

            inq.prompt([
                {
                    type: "list",
                    message: "you are about to buy " + quantity + " " + item + "(s) for a total of $" + price + ": Is that correct?",
                    choices: ["Yes", "No (return to item list)"],
                    name: "buy"
                }
            ]).then(function(data){
                console.log(data.buy)
                if(data.buy === "Yes"){

                    let sql = "update products set stock_quantity = ? where item_id = ?";
                    
                    connection.query(sql, [stock - quantityToBuy, item_id], function(err, res, flds){
                        if(err) throw err;

                    })
                    connection.end(function(err){
                        if(err) throw err;
                    })
                }else{
                    showAll()
                }
            })//end prompt
        }else{
            console.log("Sorry, there is insufficient stock to fulfill your order")
        }
    });
};









