let cartIcon = document.getElementById("cartIcon")
let cartCloseIcon = document.getElementById("add-to-cart-close-btn")
let listProductHtml = document.getElementById("list-product")
let listCartHtml = document.getElementById("list-cart")
listProduct=[]

let carts = [ ]
cartIcon.addEventListener('click' , function(){
    let body =document.body.classList.toggle("show-cart")
})

cartCloseIcon.addEventListener('click' , function(){
    let body =document.body.classList.toggle("show-cart")
})

const addDataToHtml = () => {
    listProductHtml.innerHTML = ""
    if (listProduct.length > 0) {
        listProduct.forEach(product => {
            let newProduct = document.createElement("div")
            newProduct.classList.add("item");
            newProduct.dataset.id = product.id;
            newProduct.innerHTML=`
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSBuhR-PbpqA9fLqNzASItnqfVygbYl47ZQHNjMl1j2_Qxm6zqpH1tF1TOmw&s" alt="">
            <h1 class="product-name" id="product-name">${product.name}</h1>
            <div class="product-price" id="product-price">$120</div>
            <button class="add-to-cart-btn">Add to cart</button>
            `
            listProductHtml.appendChild(newProduct)
        });
    }
}

listProductHtml.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (targetElement.classList.contains('add-to-cart-btn')) {
        let product_id = targetElement.parentElement.dataset.id;
        addToCart(product_id)
    }
 
  });
  

  const addToCart = (product_id) => {
    let positionThisProductInCart =carts.findIndex((value) => value.product_id == product_id)
    if (carts.length <= 0) {
        carts = [
            {
                product_id:product_id,
                quantity:1
            }
        ]
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id:product_id,
            quantity:1
        })
    }else{
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity +1;  
    }
    addCartToHtml()
    addCartToMemory()
  }

const addCartToMemory = () => {
    localStorage.setItem('cart' , JSON.stringify(carts));
}

listCartHtml.addEventListener('click' , function(event) {
    let positionClick  = event.target;
    if (positionClick.classList.contains('minus')  || positionClick.classList.contains('plus')) {
        let product_id =  positionClick.parentElement.parentElement.dataset.id;
        console.log(product_id);
        
        let type = 'minus'
        if(positionClick.classList.contains('plus')){
            type = 'plus'
        }
        changeQuantity(product_id , type)
        
        }
})

const changeQuantity = (product_id,type) => {
    let positionItemInCart  = carts.findIndex((value) => value.product_id = product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity +1 ; 
                break;
        
            default:
                let valueChange = carts[positionItemInCart].quantity -1 
                if (valueChange>0) {
                    carts[positionItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemInCart, 1)
                }
                break;
        }
    }
    addCartToMemory()
    addCartToHtml()
}

function addCartToHtml() {
    listCartHtml.innerHTML = ''
    if (carts.length > 0) {
        carts.forEach(cart => {
            let newCart = document.createElement('div')
            newCart.classList.add('item')
            newCart.dataset.id = cart.product_id
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id)
            let info = listProduct[positionProduct]
            newCart.innerHTML = `
            <div class="img-div">
                <img src="${info.image}" alt="">
            </div>
            <div class="name">
                <p id="product-name">${info.name}</p>
            </div>
            <div class="price">
                <p id="price">${info.price}</p>
            </div>
            <div class="controls">
                <span class="span" id="minus" class="minus">-</span>
                <span class="span" id="quantity">1</span>
                <span class="span" id="plus" class="plus">+</span>
            </div>
            `
            listCartHtml.appendChild(newCart)
        })
    }
}


const initApp = () => {
    // fetch data from JSON
    fetch("product.json")
      .then(Response => Response.json())
      .then(data => {
        listProduct = data;
        addDataToHtml()
      });
      if (localStorage.getItem('cart')) {
        carts = JSON.parse(localStorage.getItem('cart'));
        addCartToHtml()
      }
  }
initApp()