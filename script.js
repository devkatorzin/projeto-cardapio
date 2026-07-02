// ===========================
// SELETORES
// ===========================
const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const addressSection = document.getElementById("address-section")
const optEntrega = document.getElementById("opt-entrega")
const optRetirada = document.getElementById("opt-retirada")

// ===========================
// ESTADO
// ===========================
let cart = []
let tipoEntrega = "entrega" // "entrega" ou "retirada"

// ===========================
// MODAL DO CARRINHO
// ===========================

// Abrir modal
cartBtn.addEventListener("click", function () {
    updateCartModal()
    cartModal.style.display = "flex"
})

// Fechar ao clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

// Fechar ao clicar no botão fechar
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})


// ===========================
// ENTREGA OU RETIRADA
// ===========================
function selecionarEntrega(tipo) {
    tipoEntrega = tipo

    if (tipo === "entrega") {
        optEntrega.classList.add("selected")
        optRetirada.classList.remove("selected")
        addressSection.style.display = "block"
    } else {
        optRetirada.classList.add("selected")
        optEntrega.classList.remove("selected")
        addressSection.style.display = "none"

        // Limpa alertas de endereço ao trocar para retirada
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500")
    }
}


// ===========================
// ADICIONAR AO CARRINHO
// ===========================
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1
    } else {
        cart.push({ name, price, quantity: 1 })
    }

    updateCartModal()

    // Toast de confirmação
    Toastify({
        text: `✅ "${name}" adicionado ao carrinho!`,
        duration: 2000,
        gravity: "top",
        position: "right",
        stopOnFocus: false,
        style: {
            background: "#FF6B00",
            borderRadius: "8px",
            fontSize: "14px",
        },
    }).showToast()
}


// ===========================
// ATUALIZAR MODAL DO CARRINHO
// ===========================
function updateCartModal() {
    cartItemsContainer.innerHTML = ""
    let total = 0

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-6 text-gray-400">
                <i class="fa fa-shopping-cart text-4xl mb-2 block"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `
        cartTotal.textContent = "R$ 0,00"
        cartCounter.textContent = "0"
        return
    }

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "items-center", "mb-4", "pb-3", "border-b")

        cartItemElement.innerHTML = `
            <div class="flex-1">
                <p class="font-bold text-sm">${item.name}</p>
                <p class="text-xs text-gray-500">R$ ${item.price.toFixed(2).replace(".", ",")} cada</p>
            </div>

            <div class="flex items-center gap-2 mx-3">
                <button
                    class="decrease-btn w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    data-name="${item.name}"
                >−</button>

                <span class="font-bold w-5 text-center">${item.quantity}</span>

                <button
                    class="increase-btn w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    data-name="${item.name}"
                >+</button>
            </div>

            <div class="text-right min-w-[70px]">
                <p class="font-bold text-sm" style="color: #FF6B00;">
                    R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </p>
                <button
                    class="remove-from-cart-btn text-xs text-red-400 hover:text-red-600 mt-1"
                    data-name="${item.name}"
                >
                    Remover
                </button>
            </div>
        `

        total += item.price * item.quantity
        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    // Atualiza contador do footer (total de itens, não produtos únicos)
    const totalItens = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCounter.textContent = totalItens
}


// ===========================
// CONTROLES DE QUANTIDADE E REMOÇÃO
// ===========================
cartItemsContainer.addEventListener("click", function (event) {
    const name = event.target.getAttribute("data-name")

    if (event.target.classList.contains("remove-from-cart-btn")) {
        removeItemCart(name)
    }

    if (event.target.classList.contains("increase-btn")) {
        increaseItem(name)
    }

    if (event.target.classList.contains("decrease-btn")) {
        decreaseItem(name)
    }
})

function increaseItem(name) {
    const item = cart.find(i => i.name === name)
    if (item) {
        item.quantity += 1
        updateCartModal()
    }
}

function decreaseItem(name) {
    const item = cart.find(i => i.name === name)
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1
        } else {
            removeItemCart(name)
            return
        }
        updateCartModal()
    }
}

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)
    if (index !== -1) {
        cart.splice(index, 1)
        updateCartModal()
    }
}


// ===========================
// VALIDAÇÃO DO ENDEREÇO
// ===========================
addressInput.addEventListener("input", function (event) {
    if (event.target.value !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})


// ===========================
// FINALIZAR PEDIDO (WHATSAPP)
// ===========================
checkoutBtn.addEventListener("click", function () {

    // Verifica se está aberto
    const isOpen = checkStoreOpen()
    if (!isOpen) {
        Toastify({
            text: "Ops! A loja está fechada no momento.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "#ef4444", borderRadius: "8px" },
        }).showToast()
        return
    }

    // Verifica se carrinho está vazio
    if (cart.length === 0) {
        Toastify({
            text: "Adicione produtos ao carrinho primeiro!",
            duration: 2500,
            gravity: "top",
            position: "right",
            style: { background: "#f59e0b", borderRadius: "8px" },
        }).showToast()
        return
    }

    // Valida endereço se for entrega
    if (tipoEntrega === "entrega" && addressInput.value.trim() === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        addressInput.focus()
        return
    }

    // Monta a mensagem para o WhatsApp
    const cartItems = cart.map(item =>
        `- ${item.name}\n  Qtd: ${item.quantity} | R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`
    ).join("\n")

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalFormatado = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

    const modoEntrega = tipoEntrega === "entrega"
        ? `*Entrega*\nEndereco: ${addressInput.value.trim()}`
        : `*Retirada na loja*`

    const message =
        `*Pedido - Loja Kelve*\n` +
        `--------------------------------\n` +
        `${cartItems}\n` +
        `--------------------------------\n` +
        `*Total: ${totalFormatado}*\n` +
        `${modoEntrega}`

    const phone = "91991396925"
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank")

    // Limpa o carrinho após envio
    cart = []
    tipoEntrega = "entrega"
    selecionarEntrega("entrega")
    addressInput.value = ""
    updateCartModal()
    cartModal.style.display = "none"
})


// ===========================
// VERIFICAR HORÁRIO DA LOJA
// ===========================
function checkStoreOpen() {
    const agora = new Date()
    const hora = agora.getHours()
    return hora >= 8 && hora < 20
    // true = loja aberta (08h às 20h)
}

const spanItem = document.getElementById("date-span")
const isOpen = checkStoreOpen()

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}