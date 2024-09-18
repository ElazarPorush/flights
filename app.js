"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "https://66e98a6387e417609449dfc5.mockapi.io/api/";
const selectElm = document.querySelector(".addSelect");
const [male, female, agent, passengerName] = document.querySelectorAll(".addPassenger input");
const tablePassengers = document.querySelector(".passengers");
const main = document.querySelector(".main");
const editDiv = document.querySelector(".updatePassenger");
const editSelectElm = document.querySelector(".editSelect");
const [editMale, editFemale, passengerID, passengerTime, editPassengerName] = document.querySelectorAll(".updatePassenger input");
let flights;
let passengers;
const GetFlights = (select) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fetch(`${BASE_URL}flights`);
    flights = yield result.json();
    PrintFlights(select);
});
GetFlights(selectElm);
const GetPassengers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield fetch(`${BASE_URL}pasangers?agent=${agent.value}`);
        passengers = yield result.json();
        console.log(passengers);
        PrintPassengers();
    }
    catch (err) {
        console.log(err);
    }
});
GetPassengers();
const PrintFlights = (select) => {
    try {
        for (const flight of flights) {
            const option = document.createElement("option");
            option.value = flight.id;
            const isoDate = new Date(flight.date);
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const formattedDate = isoDate.toLocaleDateString('en-US', options);
            option.textContent = `${flight.from} => ${flight.to} (${formattedDate})`;
            select.appendChild(option);
        }
    }
    catch (err) {
        console.log(err);
    }
};
const PrintPassengers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        tablePassengers.innerHTML = "";
        for (const passenger of passengers) {
            const row = CreatePassenger(passenger);
            tablePassengers.appendChild(row);
        }
    }
    catch (err) {
        console.log(err);
    }
});
const AddPassenger = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!selectElm.value || !passengerName.value) {
            return undefined;
        }
        yield fetch(BASE_URL + "pasangers", {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                createdAt: new Date(),
                name: passengerName.value,
                gender: male.checked ? male.value : female.value,
                flight_id: selectElm.value,
                agent: agent.value
            })
        });
        passengerName.value = '';
        GetPassengers();
    }
    catch (err) {
        console.log(err);
    }
});
const CreatePassenger = (passenger) => {
    const row = document.createElement("div");
    row.className = "row";
    const title = document.createElement("p");
    const actions = document.createElement("div");
    actions.style.display = "flex";
    const deleteBtn = document.createElement("p");
    const editBtn = document.createElement("p");
    const flight = flights.find(flight => flight.id == passenger.flight_id);
    const isoDate = new Date(flight.date);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = isoDate.toLocaleDateString('en-US', options);
    title.textContent = `${passenger.name} - ${flight.from} => ${flight.to} (${formattedDate})`;
    deleteBtn.textContent = "🗑️";
    editBtn.textContent = "🖊️";
    deleteBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fetch(`${BASE_URL}pasangers/${passenger.id}`, {
                method: "Delete"
            });
            GetPassengers();
        }
        catch (err) {
            console.log(err);
        }
    }));
    editBtn.addEventListener("click", () => {
        try {
            editDiv.style.display = "block";
            main.style.display = "none";
            GetFlights(editSelectElm);
            if (passenger.gender === "male") {
                editMale.checked = true;
            }
            else {
                editFemale.checked = true;
            }
            editPassengerName.value = passenger.name;
            passengerTime.value = passenger.createdAt;
            passengerID.value = passenger.id;
            const indexOfOption = flights.findIndex(flight => flight.id === passenger.flight_id);
            editSelectElm.selectedIndex = indexOfOption;
            console.log(editSelectElm.value);
        }
        catch (err) {
            console.log(err);
        }
    });
    actions.appendChild(deleteBtn);
    actions.appendChild(editBtn);
    row.appendChild(title);
    row.appendChild(actions);
    return row;
};
const UpdatePassenger = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!editPassengerName.value) {
            return undefined;
        }
        yield fetch(BASE_URL + "pasangers/" + passengerID.value, {
            method: "PUT",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                createdAt: passengerTime.value,
                name: editPassengerName.value,
                gender: editMale.checked ? editMale.value : editFemale.value,
                flight_id: editSelectElm.value,
                agent: agent.value
            })
        });
        editDiv.style.display = "none";
        main.style.display = "block";
        GetPassengers();
    }
    catch (err) {
        console.log(err);
    }
});
