/* 
Kevin Barra Morales 
Proyecto Final Frambu 
16 de mayo de 2022
*/

import {
  escuchar_ordenes,
  guardar_orden,
  delete_orden,
  get_orden,
  update_orden,
} from "/fire.js";

const orderForm = document.getElementById("order-form");
const ordersContainer = document.getElementById("orders-container");

let editStatus = false;
let id = "";

window.addEventListener("DOMContentLoaded", async () => {
  escuchar_ordenes((querySnapshot) => {
    ordersContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const order = doc.data();

      ordersContainer.innerHTML += `
      <tr>
        <th scope="row">${order.cantidad}</th>
        <td>${order.cliente}</td>
        <td>${order.fecha}</td>
        <td>${order.completado == true ? "Completado" : "Pendiente"}</td>
        <td><button class="btn btn-secondary btn-edit" data-id="${doc.id}">
            <i class="bi bi-pencil-square" data-id="${doc.id}"></i>
            </button>
            <button class="btn btn-danger btn-delete" data-id="${doc.id}">
              <i class="bi bi-trash" data-id="${doc.id}"></i>
            </button>
            <button class="btn btn-success" data-id="${doc.id}">
          <i class="bi bi-check-lg" data-id="${doc.id}"></i>
            </button></td>
      </tr>`;
    });

    const btnsDelete = ordersContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async ({
        target: {
          dataset
        }
      }) => {
        try {
          delete_orden(dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = ordersContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await get_orden(e.target.dataset.id);
          const order = doc.data();
          orderForm["order-cliente"].value = order.cliente;
          orderForm["order-cantidad"].value = order.cantidad;
          document.getElementById("title").innerText = "Editar Orden 🖊️";

          id = doc.id;
          editStatus = true;
          orderForm["btn-order-form"].innerText = "Editar";
          orderForm["btn-order-form"].addEventListener("click", () => {
            document.getElementById("title").innerText = "Añadir Orden 🍓";
          });
        } catch (error) {
          console.log(error);
        }
      });
    });

    const btnCheck = ordersContainer.querySelectorAll(".btn-success");
    btnCheck.forEach((btn) =>
      btn.addEventListener("click", async ({
        target: {
          dataset
        }
      }) => {
        try {
          update_orden(dataset.id, {
            completado: true,
          });
        } catch (error) {
          console.log(error);
        }
      })
    );
  });
});

orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cliente = orderForm["order-cliente"];
  const cantidad = orderForm["order-cantidad"];
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  try {
    if (!editStatus) {
      await guardar_orden(cliente.value, cantidad.value, today);
    } else {
      update_orden(id, {
        cliente: cliente.value,
        cantidad: cantidad.value,
        fecha: today,
        completado: false,
      });

      editStatus = false;
      id = "";
      orderForm["btn-order-form"].innerText = "Save";
    }

    orderForm.reset();
    cliente.focus();
  } catch (error) {
    console.log(error);
  }
});