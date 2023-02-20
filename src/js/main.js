/*const db = new Dexie("mydb");

db.version(1).stores({
  friends: `name, age`,
});

db.open();
*/

import productdb, { bulkcreate, getdata, createEle } from "./Module.js";

let db = productdb("productdb", {
  products: `++id, name, seller, price`,
});

//input tags

const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const seller = document.getElementById("seller");
const price = document.getElementById("price");

// button tags

const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");
const notfound = document.getElementById("notfound");

btncreate.onclick = (event) => {
  let flag = bulkcreate(db.products, {
    name: proname.value,
    seller: seller.value,
    price: price.value,
  });
  // console.log(flag);

  proname.value = seller.value = price.value = "";
  getdata(db.products, (data) => {
    userid.value = data.id + 1 || 1;
  });

  table();

  let insertmsg = document.querySelector(".insertmsg");

  getMsg(flag, insertmsg);
};

btnread.onclick = table;

// update table

btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    db.products
      .update(id, {
        name: proname.value,
        seller: seller.value,
        price: price.value,
      })
      .then((updated) => {
        let get = updated ? true : false;
        let updatemsg = document.querySelector(".updatemsg");
        getMsg(get, updatemsg);
        proname.value = seller.value = price.value = "";
      });
  }
};

// delete the table

btndelete.onclick = () => {
  db.delete();
  db = productdb("productdb", {
    products: `++id, name, seller, price`,
  });
  db.open();
  table();
  textid(userid);

  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
};

window.onload = () => {
  textid(userid);
};

function textid(textboxid) {
  getdata(db.products, (data) => {
    textboxid.value = data.id + 1 || 1;
  });
}

function table() {
  const tbody = document.getElementById("tbody");

  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }

  getdata(db.products, (data) => {
    if (data) {
      createEle("tr", tbody, (tr) => {
        for (const value in data) {
          createEle("td", tr, (td) => {
            td.textContent =
              data.price === data[value] ? `$ ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, (td) => {
          createEle("i", td, (i) => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            i.onclick = editbtn;
          });
        });

        createEle("td", tr, (td) => {
          createEle("i", td, (i) => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            i.onclick = deletebtn;
          });
        });
      });
    } else {
      notfound.textContent = "No Record Found in the Database";
    }
  });
}

function editbtn(event) {
  let id = parseInt(event.target.dataset.id);
  db.products.get(id, (data) => {
    userid.value = data.id || 0;
    proname.value = data.name || "";
    seller.value = data.seller || "";
    price.value = data.price || "";
  });
}

function deletebtn(event) {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  table();
}

function getMsg(flag, element) {
  if (flag) {
    element.classList += " movedown";

    setTimeout(() => {
      element.classList.forEach((classname) => {
        classname == "movedown"
          ? undefined
          : element.classList.remove("movedown");
      });
    }, 4000);
  }
}
