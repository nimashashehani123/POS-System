import {customer_array,item_array} from "../db/database.js";
export function loadCustomerselect () {
    $("#customerSelect").empty();
    $("#customerSelect").append('<option>Select Customer</option>');

    customer_array.map((item,number) => {
      let data = `<option>${item.id}</option>`;
      $("#customerSelect").append(data);
    });
  };
export function loadItemselect () {
    $("#itemSelect").empty();
    $("#itemSelect").append('<option>Select Item</option>');

    item_array.map((item,number) => {
      let data = `<option>${item.itemid}</option>`;
      $("#itemSelect").append(data);
    });
  };



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