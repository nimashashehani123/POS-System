import CustomerModel from "../models/CustomerModel.js";
import {customer_array} from "../db/database.js";


let editingRow = null;


//generate id
const getNextCustomerId = () => {
    return customer_array.length > 0 ? customer_array.length + 1 : 1;
};

//load customers
const loadCustomerTable = () => {
    $("#customerTableBody").empty();

    customer_array.forEach(item => {
        const customerRow = `
            <tr data-id="${item.cusid}">
                <td>${item.cusid}</td>
                <td>${item.firstname}</td>
                <td>${item.lastname}</td>
                <td>${item.mobile}</td>
                <td>${item.email}</td>
                <td>${item.address}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn">delete</button>
                    <button class="btn btn-secondary btn-sm update-btn">update</button>
                </td>
            </tr>`;
        $('#customerTableBody').append(customerRow);
    });

    $('#customerid').val(getNextCustomerId());
};

//save
const saveCustomer = () => {
    const cus_id = editingRow ? $('#customerid').val() : getNextCustomerId();
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const mobile = $('#mobile').val();
    const email = $('#email').val();
    const address = $('#address').val();

    let customer = new CustomerModel(cus_id,firstName,lastName,mobile,email,address);

    if (editingRow) {

        const index = customer_array.findIndex(item => item.cusid == cus_id);
        if (index !== -1) {
            customer_array[index] = customer;
        }
        editingRow = null;
        $('#add-customer-btn').text('Add Customer');
    } else {

        customer_array.push(customer);
    }

    $('#customerForm')[0].reset();
    loadCustomerTable();

    console.log(customer_array)
};

//delete
const deleteCustomer = (cus_id) => {
    customer_array = customer_array.filter(item => item.cusid != cus_id);
    loadCustomerTable();
};

//update
const editCustomer = (cus_id) => {
    const customer = customer_array.find(item => item.cusid == cus_id);
    if (customer) {
        $('#customerid').val(customer.cusid);
        $('#firstName').val(customer.firstname);
        $('#lastName').val(customer.lastname);
        $('#mobile').val(customer.mobile);
        $('#email').val(customer.email);
        $('#address').val(customer.address);
        editingRow = $(`#customerTableBody tr[data-id="${cus_id}"]`);
        $('#add-customer-btn').text('Update Customer');
    }
};

// Search
const searchCustomers = (searchValue) => {
    const lowerCaseValue = searchValue.toLowerCase();
    $('#customerTableBody tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(lowerCaseValue) > -1);
    });
};


$('#add-customer-btn').on('click', saveCustomer);

$('#customerTableBody').on('click', '.delete-btn', function () {
    const cus_id = $(this).closest('tr').data('id');
    deleteCustomer(cus_id);
});

$('#customerTableBody').on('click', '.update-btn', function () {
    const cus_id = $(this).closest('tr').data('id');
    editCustomer(cus_id);
});

$('#customerSearch').on('keyup', function () {
    const value = $(this).val();
    searchCustomers(value);
});


$('#customerForm').on('reset', function () {
    editingRow = null;
    $('#add-customer-btn').text('Add Customer');
});


loadCustomerTable();

