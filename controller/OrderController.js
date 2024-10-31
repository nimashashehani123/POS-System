import {customer_array,item_array,order_array,cart} from "../db/database.js";
import OrderModel from "../models/OrderModel.js";
import CartModel from "../models/cartModel.js";
import ItemModel from "../models/ItemModel.js";

//generate id
const getNextOrderId = () => {
    let id1 ;
    let index = order_array.length;

    if(index > 0 ){
        id1 = Number(order_array[order_array.length - 1].orderid);
    }else {
        id1 = 0;
    }
    let id = id1 + 1;
    return id;
};


// load customers
export function loadCustomerselect () {
    $("#customerSelect").empty();
    $("#customerSelect").append('<option>Select Customer</option>');

    customer_array.map((item,number) => {
      let data = `<option>${item.id}</option>`;
      $("#customerSelect").append(data);
    });
  };


// load items
export function loadItemselect () {
    $("#itemSelect").empty();
    $("#itemSelect").append('<option>Select Item</option>');

    item_array.map((item,number) => {
      let data = `<option>${item.itemid}</option>`;
      $("#itemSelect").append(data);
    });
  };


//set customer details
  $('#customerSelect').on('change', function () {
    let selectedCustomerId = $(this).val();
      let selectedCustomer = null;

      for (let i = 0; i < customer_array.length; i++) {
          if (customer_array[i].id == selectedCustomerId) {
              selectedCustomer = customer_array[i];
              break;
          }
      }

      if (selectedCustomer) {
          $('#customerName').val(`${selectedCustomer.first_name} ${selectedCustomer.last_name}`);
      } else {
          $('#customerName').val('');
      }
  });


  // set item details
  $('#itemSelect').on('change', function () {
    let selectedItemId = $(this).val();
      let selecteditem = null;

      for (let i = 0; i < item_array.length; i++) {
          if (item_array[i].itemid == selectedItemId) {
             selecteditem = item_array[i];
              break;
          }
      }

      if (selecteditem) {
          $('#quantityOnHand').val(`${selecteditem.quantity}`);
          $('#itemImage2').attr('src', selecteditem.imageURL);
          $('#unitPrice').val(`${selecteditem.price}`);
      } else {
          $('#quantityOnHand').val('');
          $('#itemImage2').attr('src', '');
          $('#unitPrice').val('');
      }
  });


// laod orders
const loadOrderTable = () => {
    $("#orderdetailsTableBody").empty();

    order_array.map((item,index) => {
        const orderRow = `
        <tr>
            <td>${item.orderid}</td>
            <td>${item.customer_name}</td>
            <td>${item.date}</td>
            <td>${parseFloat(item.total)}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-order-btn">Delete</button>
            </td>
        </tr>`;
        $('#orderdetailsTableBody').append(orderRow);
    });
    $('#orderid').val(getNextOrderId());
};


//add to cart
const addToCart = () =>{
  let itemid = $('#itemSelect').val();
  let qty = $('#quantity').val();
  let unitprice = $('#unitPrice').val();
  let quantityOnHand = parseInt($('#quantityOnHand').val(), 10);

    if (qty > quantityOnHand) {
        alert("Quantity exceeds available stock!");
        $('#quantity').focus();
        return;
    }

  let total = qty * unitprice;

    let index = -1;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].itemid === itemid) {
            index = i;
            break;
        }
    }

    if (index !== -1) {
        let item = cart[index];
        let qty1 = parseInt(item.qty) + parseInt(qty);
        console.log(qty1)
        item.qty = qty1;
        console.log(item.qty);
        item.total = item.qty * unitprice;
        cart[index] = item;
        updateQtyOnHand(itemid,qty);

    } else {
        let cartitem = new CartModel(itemid,qty,unitprice,total);
        cart.push(cartitem);
        updateQtyOnHand(itemid,qty);
    }
    clearorderform();
    console.log(cart);
    loadToCart();

};

const updateQtyOnHand = (itemid,quantityPurchased) => {
    let item = null;
    let index = -1;

    for (let i = 0; i < item_array.length; i++) {
        if (item_array[i].itemid == itemid) {
            item = item_array[i];
            index = i;
            break;
        }
    }

    if (item) {
        item.quantity -= quantityPurchased;
        $('#quantityOnHand').val(item.quantity);
    }

    let demoitem = new ItemModel(item.itemid,item.name,item.description,item.quantity,item.price,item.imageURL);
    item_array[index] = demoitem;
}

export const clearorderform = () =>{
    $('#itemSelect').val('Select Item');
    $('#quantityOnHand').val('');
    $('#unitPrice').val('');
    $('#quantity').val('');
    $('#itemImage2').attr('src', '');

}


//load cartitems to cart
const loadToCart = () =>{
    $('#orderTableBody').empty();
    cart.map((item ,index ) => {
        const cartitemRow = `
            <tr>
                <td>${item.itemid}</td>
                <td>${item.qty}</td>
                <td>${item.unitprice}</td>
                <td>${item.total}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn">delete</button>                
                </td>
            </tr>`;
        $('#orderTableBody').append(cartitemRow);
    });

    $('#netTotal').text(calculateTotal().toFixed(2));
    $('#discountedTotal').text(calculateTotal().toFixed(2));
};

const deleteCartItem = (item_id) => {

    let index = -1;
    let quantityToReturn = 0;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].itemid === item_id) {
            index = i;
            quantityToReturn = parseInt(cart[i].qty);
            break;
        }
    }

    if (index !== -1) {
        cart.splice(index, 1);
        updateQtyOnHand2(item_id,quantityToReturn);
        loadToCart();
        clearorderform();
    }
}

const updateQtyOnHand2 = (itemid,quantityPurchased) => {
    let item = null;
    let index = -1;

    for (let i = 0; i < item_array.length; i++) {
        if (item_array[i].itemid == itemid) {
            item = item_array[i];
            index = i;
            break;
        }
    }

    if (item) {
        item.quantity += parseInt(quantityPurchased);
    }

    let demoitem = new ItemModel(item.itemid,item.name,item.description,item.quantity,item.price,item.imageURL);
    item_array[index] = demoitem;
}
const deleteOrder = (order_id) =>{

    let index = -1;

    for (let i = 0; i < order_array.length; i++) {
        if (order_array[i].orderid === order_id) {
            index = i;
            break;
        }
    }

    if (index !== -1) {
        order_array.splice(index, 1);
        loadOrderTable();
    }
}

const placedOrder = () =>{
   let orderid = $('#orderid').val();
   let customername = $('#customerName').val();
   let date = $('#date').val();
    let total = parseFloat($('#discountedTotal').text()) || 0;


    let order = new OrderModel(orderid,customername,date,total);

    order_array.push(order);
    clearorderform();
    $('#customerSelect').val('Select Customer');
    $('#customerName').val('');
    $('#orderTableBody').empty();
    $('#netTotal').text('0.00');
    $('#discountedTotal').text('0.00');
    cart.length = 0;
    loadOrderTable();

}

const calculateTotal = () =>{
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].total;
    }
    return parseFloat(total);
}

const calculateNetTotal = () => {
    let discount = parseFloat($('#discount').val()) || 0;
    let total = parseFloat($('#netTotal').text()) || 0;

    let discountedTotal;

    if (discount > 0) {
        discountedTotal = total - (total * (discount / 100));
    } else {
        discountedTotal = total;
    }

    console.log("Discount:", discount);
    console.log("Total:", total);
    console.log("Discounted Total:", discountedTotal);
    $('#discountedTotal').text(discountedTotal.toFixed(2));
    $('#discount').val('');
    return discountedTotal;
};

const searchOrders = (searchValue) => {
    const lowerCaseValue = searchValue.toLowerCase();
    $('#orderdetailsTableBody tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(lowerCaseValue) > -1);
    });
};


$('#addorderbtn').on('click', addToCart)
$('#orderTableBody').on('click', '.delete-btn', function () {
    const index = $(this).closest('tr').index();
    const item_id = cart[index].itemid;
    deleteCartItem(item_id);
});

$('#placeOrderBtn').on('click', placedOrder);
$('#orderdetailsTableBody').on('click', '.delete-order-btn', function () {
    const index = $(this).closest('tr').index();
    const order_id = order_array[index].orderid;
    deleteOrder(order_id);
});

$('#discountbtn').on('click',calculateNetTotal)

// Update event listener for order search
$('#orderSearch').on('keyup', function () {
    const value = $(this).val();
    searchOrders(value);
});
loadOrderTable();
