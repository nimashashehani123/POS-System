import {item_array} from "../db/database.js";
import ItemModel from "../models/ItemModel.js";

let editingItem = null;

//generate id
const getNextItemId = () => {
    return item_array.length > 0 ? item_array.length + 1 : 1;
};

//load items
const loadItemTable = () => {
    $("#itemTableBody").empty();

    item_array.forEach(item => {
        const itemRow = `
        <tr data-id="${item.itemid}">
            <td>${item.itemid}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td><img src="${item.imageURL}" alt="${item.name}" width="100" height="100"></td>
            <td>
                <button class="btn btn-danger btn-sm delete-item-btn">Delete</button>
                <button class="btn btn-secondary btn-sm update-item-btn">Update</button>
            </td>
        </tr>`;
        $('#itemTableBody').append(itemRow);
    });

    $('#itemid').val(getNextItemId());
};

//save
const saveItem = () => {
    const item_id = editingItem ? $('#itemid').val() : getNextItemId();
    const itemName = $('#itemName').val();
    const itemDescription = $('#itemDescription').val();
    const quantity = $('#quantity').val();
    const price = $('#price').val();
    const itemImage = $('#itemImage')[0].files[0];
    let imageURL = '';

    if (itemImage) {
        imageURL = URL.createObjectURL(itemImage);
    } else if (editingItem) {
        imageURL = item_array.find(item => item.itemid == item_id).imageURL;
    }

    let item = new ItemModel(item_id,itemName,itemDescription,quantity,price,imageURL);

    if (editingItem) {
        const index = item_array.findIndex(item => item.itemid == item_id);
        if (index !== -1) {
            item_array[index] = item;
        }
        editingItem = null;
        $('#add-item-btn').text('Add Item');
    } else {
        item_array.push(item);
    }

    $('#itemForm')[0].reset();
    loadItemTable();
};

//delete
const deleteItem = (item_id) => {
    item_array = item_array.filter(item => item.itemid != item_id);
    loadItemTable();
};


//update
const editItem = (item_id) => {
    const item = item_array.find(item => item.itemid == item_id);
    if (item) {
        $('#itemid').val(item.itemid);
        $('#itemName').val(item.name);
        $('#itemDescription').val(item.description);
        $('#quantity').val(item.quantity);
        $('#price').val(item.price);
        $('#imagePreview').attr('src', item.imageURL);
        $('#imagePreviewContainer').show();

        editingItem = $(`#itemTableBody tr[data-id="${item_id}"]`);
        $('#add-item-btn').text('Update Item');
    }
};

//search
const searchItems = (searchValue) => {
    const lowerCaseValue = searchValue.toLowerCase();
    $('#itemTableBody tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(lowerCaseValue) > -1);
    });
};


$('#add-item-btn').on('click', saveItem);

$('#itemTableBody').on('click', '.delete-item-btn', function () {
    const item_id = $(this).closest('tr').data('id');
    deleteItem(item_id);
});

$('#itemTableBody').on('click', '.update-item-btn', function () {
    const item_id = $(this).closest('tr').data('id');
    editItem(item_id);
});

$('#itemSearch').on('keyup', function () {
    const value = $(this).val();
    searchItems(value);
});

$('#itemForm').on('reset', function () {
    editingItem = null;
    $('#add-item-btn').text('Add Item');
});

loadItemTable();


