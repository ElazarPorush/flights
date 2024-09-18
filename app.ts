const BASE_URL = "https://66e98a6387e417609449dfc5.mockapi.io/api/"
const selectElm: HTMLSelectElement = document.querySelector(".addSelect")!
const [male, female, agent, passengerName]:NodeListOf<HTMLInputElement> = document.querySelectorAll(".addPassenger input")!
const tablePassengers: HTMLDivElement = document.querySelector(".passengers")!
const main: HTMLDivElement = document.querySelector(".main")!
const editDiv: HTMLDivElement = document.querySelector(".updatePassenger")!
const editSelectElm: HTMLSelectElement = document.querySelector(".editSelect")!
const [editMale, editFemale, passengerID, passengerTime, editPassengerName]:NodeListOf<HTMLInputElement> = document.querySelectorAll(".updatePassenger input")!

let flights: Flight[]
let passengers: Passenger[]

const GetFlights = async (select: HTMLSelectElement): Promise<void> => {
    const result = await fetch(`${BASE_URL}flights`)
    flights = await result.json()
    PrintFlights(select)
}
GetFlights(selectElm)

const GetPassengers = async (): Promise<void> => {
    try {
    const result = await fetch(`${BASE_URL}pasangers?agent=${agent.value}`)
    passengers = await result.json()
    console.log(passengers);
    
    PrintPassengers()
    }
    catch (err) {
        console.log(err);
    }
}
GetPassengers()

const PrintFlights = (select: HTMLSelectElement): void => {
    try {
        for (const flight of flights) {
            const option = document.createElement("option")
            option.value = flight.id
            const isoDate = new Date(flight.date);
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const formattedDate = isoDate.toLocaleDateString('en-US', options);
            option.textContent = `${flight.from} => ${flight.to} (${formattedDate})`
            select.appendChild(option)
        }
    }
    catch (err) {
        console.log(err);
    }
}

interface Flight {
    date: string,
    from: string,
    to: string,
    id: string
  }

interface Passenger {
    createdAt: string,
    name: string,
    gender: string,
    flight_id: string,
    agent: string,
    id: string
}

const PrintPassengers = async (): Promise<void> => {
    try {
        tablePassengers.innerHTML = ""
        for (const passenger of passengers){
            const row = CreatePassenger(passenger)
            tablePassengers.appendChild(row)
        }
    }
    catch (err) {
        console.log(err);
        
    }
}

const AddPassenger = async (): Promise<void> => {
    try {
        if (!selectElm.value || !passengerName.value) {
            return undefined
        }
        await fetch(BASE_URL + "pasangers", {
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
        })
        passengerName.value = ''
        GetPassengers()
    }
    catch (err) {
        console.log(err);
    }
}

const CreatePassenger = (passenger: Passenger):HTMLDivElement => {
    const row = document.createElement("div")
    row.className = "row"
    const title = document.createElement("p")
    const actions = document.createElement("div")
    actions.style.display = "flex"
    const deleteBtn = document.createElement("p")
    const editBtn = document.createElement("p")

    const flight: Flight = flights.find(flight => flight.id == passenger.flight_id)!
    const isoDate = new Date(flight.date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = isoDate.toLocaleDateString('en-US', options);
    
    title.textContent = `${passenger.name} - ${flight.from} => ${flight.to} (${formattedDate})`
    deleteBtn.textContent = "🗑️"
    editBtn.textContent = "🖊️"

    deleteBtn.addEventListener("click", async(): Promise<void> => {
        try {
            await fetch(`${BASE_URL}pasangers/${passenger.id}`, {
                method: "Delete"
            })
            GetPassengers()
        }
        catch (err) {
            console.log(err);   
        }
    })
    editBtn.addEventListener("click", (): void => {
        try {
            editDiv.style.display = "block"
            main.style.display = "none"
            GetFlights(editSelectElm)
            if (passenger.gender === "male"){
                editMale.checked = true
            }
            else {
                editFemale.checked = true
            }
            editPassengerName.value = passenger.name
            passengerTime.value = passenger.createdAt
            passengerID.value = passenger.id
            const indexOfOption = flights.findIndex(flight => flight.id === passenger.flight_id)
            editSelectElm.selectedIndex = indexOfOption
            console.log(editSelectElm.value);
            
        }
        catch (err) {
            console.log(err);
        }
    })

    actions.appendChild(deleteBtn)
    actions.appendChild(editBtn)
    row.appendChild(title)
    row.appendChild(actions)

    return row
}

const UpdatePassenger = async():Promise<void> => {
    try {
        if (!editPassengerName.value) {
            return undefined
        }
        await fetch(BASE_URL + "pasangers/" + passengerID.value, {
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
        })
        editDiv.style.display = "none"
        main.style.display = "block"
        GetPassengers()
    }
    catch (err) {
        console.log(err);
    }
}