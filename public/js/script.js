let path = [""];
let subject = [""];
let subjectLink = [""];

let input = document.getElementsByTagName("input")[0];

function myFunction() {
  let ul = document.getElementsByTagName("ul")[0];
  let filter = input.value.toUpperCase();
  let maximum = 0;
  ul.innerHTML = "";
  for (i = 2; i < subject.length; i++) {
    if (subject[i].toUpperCase().indexOf(filter) > -1) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.href = subjectLink[i] + path[i];
      a.target = "_blank";
      a.innerText = subject[i];
      a.style.textDecoration = "none";
      li.className = "list-group-item";
      maximum = maximum + 1;
      if (maximum <= 5) {
        if (input.value == "") {
          ul.innerHTML = "";
        } else {
          li.appendChild(a);
          ul.appendChild(li);
        }
      }
    }
  }
}

function FetchData() {
  return new Promise((resolve) => {
    firebase
      .database()
      .ref("semester")
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          path.push(childSnapshot.val().path);
          subject.push(childSnapshot.val().subject);
          subjectLink.push(childSnapshot.val().subjectLink);
        });
      });
    resolve();
  });
}

(async () => {
  try {
    console.log("Retrieving Data");
    await FetchData();
    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    })().then(() => {
      input.placeholder = "Search";
      input.disabled = false;
      console.log("Complete");
    });
  } catch (error) {
    console.log(error);
  }
})();
