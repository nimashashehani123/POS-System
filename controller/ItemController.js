import {customer_array, item_array} from "../db/database.js";
import ItemModel from "../models/ItemModel.js";
import {loadItemselect,clearorderform} from "./OrderController.js";

let editingItem = null;

$('#itemImage').on('change', function () {
    const file = this.files[0];
    console.log("File selected:", file); // Check if file is logged correctly
    if (file) {
        const imageURL = URL.createObjectURL(file);
        $('#imagePreview').attr('src', imageURL).show();
    } else {
        $('#imagePreview').attr('src', '').hide();
    }
});


//generate id
const getNextItemId = () => {
    let id1 ;
    let index = item_array.length;

    if(index > 0 ){
        id1 = Number(item_array[item_array.length - 1].itemid);
    }else {
        id1 = 0;
    }

    let id = id1 + 1;
    return id;
};

//load items
const loadItemTable = () => {
    $("#itemTableBody").empty();

    item_array.map((item,index) => {
        const itemRow = `
        <tr>
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
    const quantity = $('#qty').val();
    const price = $('#price').val();
    const itemImage = $('#itemImage')[0].files[0];
    let imageURL = '';

    if (itemImage) {
        imageURL = URL.createObjectURL(itemImage);

    } else if (editingItem) {
        imageURL = editingItem.imageURL;
    }

    let item = new ItemModel(item_id,itemName,itemDescription,quantity,price,imageURL);

    if (editingItem) {
        let index = -1;

        for (let i = 0; i < item_array.length; i++) {
            if (item_array[i].itemid === editingItem.itemid) {
                index = i;
                break;
            }
        }
        let id = editingItem.itemid;
        const itemName = $('#itemName').val();
        const itemDescription = $('#itemDescription').val();
        const quantity = $('#qty').val();
        const price = $('#price').val();

        if (index !== -1) {
            let item = new ItemModel(id,
                itemName,
                itemDescription,
                quantity,
                price,
                imageURL);

           item_array[index] = item;
        }
        editingItem = null;
        $('#add-item-btn').text('Add Item');
    } else {
        item_array.push(item);
        loadItemselect();
    }

    $('#itemForm')[0].reset();
    clearorderform();
    loadItemTable();
};

//delete
const deleteItem = (item_id) => {
    let index = -1;

    for (let i = 0; i < item_array.length; i++) {
        console.log(item_array[i].itemid);
        console.log(item_id);
        if (item_array[i].itemid === item_id) {
            index = i;
            break;
        }
    }

    if (index !== -1) {
        item_array.splice(index, 1);

        $('#itemForm')[0].reset();
        clearorderform();
        loadItemTable();
    }

};


//update
const editItem = (item) => {
    if (item) {
        $('#itemid').val(item.itemid);
        $('#itemName').val(item.name);
        $('#itemDescription').val(item.description);
        $('#qty').val(item.quantity);
        $('#price').val(item.price);
        $('#imagePreview').attr('src', item.imageURL).show();
        editingItem = item;
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
    const index = $(this).closest('tr').index();
    const item_id = item_array[index].itemid;
    deleteItem(item_id);
});

$('#itemTableBody').on('click', '.update-item-btn', function () {
    let index = $(this).closest('tr').index();
    editItem(item_array[index]);
});

$('#itemSearch').on('keyup', function () {
    const value = $(this).val();
    searchItems(value);
});

loadItemTable();

