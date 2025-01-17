const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('check-btn')
const closeModalBtn = document.getElementById('close-btn')
const cartCounter = document.getElementById('cart-cout')
const addressInput = document.getElementById('address')
const addressObs = document.getElementById('address-obs')
const addressWarn = document.getElementById('addressWarn')

let cart = []

cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest('.add-to-cart-btn')

    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat( parentButton.getAttribute('data-price'))

        addToCart(name, price)
    }
})

function addToCart (name, price) {
    const existItem = cart.find(item => item.name === name)

    if(existItem){

        existItem.quantity += 1

    }else{

        cart.push({
            name,
            price,
            quantity: 1, 

        })

    }

    updateCartMoodal()

}

function updateCartMoodal (){
    cartItemContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex","justify-between","mb-4","flex-col")

        cartItemElement.innerHTML = `

    <div class="flex items-center justify-between">

        <div> 
          <p class="font-mediun">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
        </div>
        
          <button class="remuve-btn" data-name="${item.name}">
           remover
          </button>

    </div>
        `

        total += item.price * item.quantity;

        cartItemContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("py-BR",{
        style:"currency",
        currency:"BRL"
    });

    cartCounter.innerHTML = cart.length;
}

cartItemContainer.addEventListener('click', function(event){
    if(event.target.classList.contains("remuve-btn")){
        const name = event.target.getAttribute("data-name")
     removeItem(name)
    }
})

function removeItem(name){

    const index = cart.findIndex(item => item.name === name);
    
    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartMoodal()
            return
        }

        cart.splice(index, 1)
        updateCartMoodal()
    }

}


addressInput.addEventListener('input', function(event){
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressWarn.classList.add("hidden")
    addressInput.classList.remove("border-red-500")
  }
});

addressObs.addEventListener('input', function(event){
    let inputValue = event.target.value;
});

checkoutBtn.addEventListener("click", function(){
    const IsOpen = checkHorario();
    if(!IsOpen){
        Toastify({
            text: "OPS estamos fechados",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();

          return;
    }

    if(cart.length === 0 )return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    const cartItems = cart.map((item) => {
        return(
        `${item.name}ㅤQuantidade: (${item.quantity})ㅤPreço: R$${item.price}ㅤㅤ
        ㅤ|`
        )
    }).join("")

   const massage = encodeURIComponent(cartItems)
   const phone = "5585994510659"

   window.open(`https://wa.me/${phone}?text=${massage} Endereço:${addressInput.value}ㅤㅤ OBS:${addressObs.value}`, "_blank")

   cart = []
   updateCartMoodal

})


function checkHorario(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 17 && hora < 22;
}


const spanItem = document.getElementById("date-span")
const IsOpen = checkHorario()

if(IsOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}