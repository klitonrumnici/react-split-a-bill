import {useState} from "react";

const initialFriends = [
    {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
];

function Button({children, onClick}) {

    return <button className="button" onClick={onClick}>{children}</button>
}

export default function App() {
    const [showAddFriend, setShowAddFriend] = useState(false)
    const [friends, setFriends] = useState(initialFriends)
    const [selectedFriend, setSelectedFriend] = useState(null)


    function handleAddNewFriends(friend) {
        setFriends(friends => [...friends, friend])
        setShowAddFriend(false)
    }

    function handleShowAddFriend() {
        setShowAddFriend(show => !show)
    }

    function handleSelection(friend){
        // setSelectedFriend(friend)
        setSelectedFriend(cur=> cur?.id === friend.id ? null : friend)
        setShowAddFriend(false)

    }

    function handleSplitBill(value){
        setFriends(friends => friends.map(friend=> friend.id === selectedFriend.id ? {
            ...friend, balance: friend.balance + value
        } : friend))

        setSelectedFriend(null)
    }



    return (
        <div className="app">
            <div className="sidebar">
                <FriendsList friends={friends} selectedFriend={selectedFriend} onSelection={handleSelection}/>

                {showAddFriend && <FormAddFriend onHandleAddFriend={handleAddNewFriends}/>}
                <Button onClick={handleShowAddFriend}>{showAddFriend ? "Close" : "Add Friend"}</Button>
            </div>

            <div>
                {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill}/>}
            </div>
        </div>
    )


}

function FriendsList({friends, onSelection, selectedFriend}) {


    return <ul>
        {friends.map((friend) => (
            <div key={friend.id}>
                <Friend friend={friend} selectedFriend={selectedFriend} onSelection={onSelection}/>
            </div>
        ))}
    </ul>
}

function Friend({friend, selectedFriend, onSelection}) {
    const isSelected = selectedFriend?.id === friend.id;
    console.log(isSelected);

    return <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name}/>
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (<p className="red">You owe {friend.name} {Math.abs(friend.balance)}$</p>)}
        {friend.balance > 0 && (<p className="green">{friend.name} owes you {Math.abs(friend.balance)}$</p>)}
        {friend.balance === 0 && (<p>You and your friend {friend.name} are even</p>)}
        <Button onClick={()=>onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
    </li>
}

function FormAddFriend({onHandleAddFriend}) {
    const [name, setName] = useState("")
    const [image, setImage] = useState("https://i.pravatar.cc/48")

    function handleSubmit(e) {
        e.preventDefault();
        if (!name || !image) return
        const id = crypto.randomUUID()

        const newFriend = {
            id, name, image: `${image}?=${id}`, balance: 0,
        }
        onHandleAddFriend(newFriend)

        setName("")
        setImage("https://i.pravatar.cc/48")
    }


    return <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>Friend name</label>
        <input typeof="text" value={name} onChange={(e) => {
            setName(e.target.value)
        }}/>

        <label>Image URL</label>
        <input typeof="text" value={image} onChange={(e) => {
            setImage(e.target.value)
        }}/>

        <Button>Add</Button>
    </form>
}

function FormSplitBill({selectedFriend, onSplitBill}) {
    const [bill, setBill] = useState("")
    const [paidByUser, setPaidByUser] = useState("")
    const paidByFriend = bill ? bill - paidByUser : ""
    const [whoIsPaying, setWhoIsPaying] = useState("user")

    function handleSubmit(e){
        e.preventDefault()
        if(!bill || !paidByUser) return;
        onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser)

    }
    return <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>💰 Split a Bill with {selectedFriend.name} </h2>

        <label>💸 Bill Value</label>
        <input typeof="text" value={bill} onChange={e=>setBill(+(e.target.value))}/>

        <label>👨‍🦲Your Expense</label>
        <input typeof="text" value={paidByUser} onChange={e=>setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))}/>

        <label>👳‍♀️{selectedFriend.name} Expense</label>
        <input typeof="text" disabled value={paidByFriend}/>

        <label>💷 Who is paying the bill</label>
        <select value={whoIsPaying} onChange={e=>setWhoIsPaying(e.target.value)}>
            <option value="user">You</option>
            <option value="friend">{selectedFriend.name}</option>
        </select>

        <Button>Split Bill</Button>
    </form>
}