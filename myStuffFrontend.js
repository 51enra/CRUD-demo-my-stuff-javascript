//debugger;
const url = 'http://localhost:8080/api/v1/items';
let method;
let info;
(async () => {
  // Create table with one row per DB item
  fetch(url)
    .then(response => response.json())
    .then(data => {
      let tbody = '';
      data.forEach(item => {
        //console.log(item);
        tbody += `
          <tr>
          <th scope="row">${item.id}</th>
          <td>${item.name}</td>
          <td>${item.location}</td>
          <td>${item.amount}</td>
          <td>
            <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#itemModal">
                View / Modify</button>
            <button type="button" class="btn btn-danger btn-sm">Delete</button>
          </td>
          </tr>
          `;
      });

      // Define action of Update and Delete buttons per table row
      document.querySelector('tbody').innerHTML = tbody;
      var table = document.getElementsByTagName("tbody")[0];
      var rows = table.getElementsByTagName("tr");
      for (i = 0; i < rows.length; i++) {

        let clickDelete = function (currentRow) {
          return function () {
            const id = currentRow.getElementsByTagName("th")[0].innerHTML;
            fetch(url + '/' + id, { method: 'DELETE' })
              .then(response => {
                alert('Item ' + id + ' was deleted!');
                location.reload();
              });
          }
        };

        let clickUpdate = function (currentRow) {
          return function () {
            const id = currentRow.getElementsByTagName("th")[0].innerHTML;
            fetch(url + '/' + id, { method: 'GET' })
              .then(response => response.json())
              .then(item => {
                document.getElementById("itemId").value = item.id;
                document.getElementById("itemName").value = item.name;
                document.getElementById("itemAmount").value = item.amount;
                document.getElementById("itemLastUsed").value = item.lastUsed;
                document.getElementById("itemLocation").value = item.location;
                document.getElementById("itemDescription").value = item.description;
              });
            method = 'PUT';
            info = 'updated';
          }
        };

        rows[i].getElementsByClassName("btn-danger")[0].onclick = clickDelete(rows[i]);
        rows[i].getElementsByClassName("btn-primary")[0].onclick = clickUpdate(rows[i]);
      };
    })
})();

// The New button opens the modal with empty fields
document.getElementById("newItem").onclick = function () {
  document.getElementById("itemId").value = null;
  document.getElementById("itemName").value = null;
  document.getElementById("itemAmount").value = null;
  document.getElementById("itemLastUsed").value = null;
  document.getElementById("itemLocation").value = null;
  document.getElementById("itemDescription").value = null;
  // Variables used for save action
  method = 'POST';
  info = 'created';
}

// The Save button in the modal can either create or update an item 
document.getElementById("saveItem").onclick = function () {
  const item = {
    id: method == 'PUT' ? parseInt(document.getElementById("itemId").value) : null,
    name: document.getElementById("itemName").value,
    amount: parseInt(document.getElementById("itemAmount").value),
    lastUsed: document.getElementById("itemLastUsed").value,
    location: document.getElementById("itemLocation").value,
    description: document.getElementById("itemDescription").value
  };

  const fullUrl = url + (item.id ? '/' + item.id : '');
  fetch(fullUrl, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(item => {
      alert(`Item  ${item.id} was ${info} !`);
      location.reload();
    });
}