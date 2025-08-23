document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".btn-tab")
  const contents = document.querySelectorAll(".tab-content")
  const addPostBtn = document.getElementById("add-post-btn")
  const chatItems = document.querySelectorAll(".chat-item")
  const chatWindow = document.getElementById("chat-window")
  const chatBody = document.getElementById("chat-body")
  const chatName = document.getElementById("chat-name")
  const backBtn = document.getElementById("back-to-messages")
  const messageInput = document.getElementById("message-input")
  const sendBtn = document.getElementById("send-btn")
  const likeBtns = document.querySelectorAll(".like-btn")

  // Simula um banco de dados de posts
  const posts = {
    1: { likes: 25, isLiked: false },
    2: { likes: 12, isLiked: false },
    3: { likes: 30, isLiked: false },
    4: { likes: 8, isLiked: false },
  }

  const chatHistory = {
    admin: [
      {
        sender: "received",
        text: "Olá! A manutenção do elevador foi agendada para amanhã.",
      },
      { sender: "sent", text: "Ok, obrigado pelo aviso!" },
    ],
    vania: [
      {
        sender: "received",
        text: "Olá, você ainda está precisando de ajuda com a furadeira?",
      },
      {
        sender: "sent",
        text: "Sim! Se puder me emprestar, eu agradeço muito.",
      },
    ],
    grupo_a: [
      {
        sender: "received",
        text: "Alguém viu a chave do salão de festas?",
      },
      {
        sender: "sent",
        text: "Acho que está com o porteiro, vou verificar.",
      },
    ],
  }

  function showCorrectBtn() {
    // Mostra o botão flutuante apenas na aba 'home'
    if (document.getElementById("home").classList.contains("active")) {
      addPostBtn.style.display = "flex"
    } else {
      addPostBtn.style.display = "none"
    }
  }

  function renderMessages(chatId) {
    chatBody.innerHTML = ""
    const messages = chatHistory[chatId]
    messages.forEach((msg) => {
      const bubble = document.createElement("div")
      bubble.classList.add("message-bubble", msg.sender)
      bubble.textContent = msg.text
      chatBody.appendChild(bubble)
    })
    // Rola para a última mensagem
    chatBody.scrollTop = chatBody.scrollHeight
  }

  function sendMessage() {
    const text = messageInput.value.trim()
    if (text) {
      const bubble = document.createElement("div")
      bubble.classList.add("message-bubble", "sent")
      bubble.textContent = text
      chatBody.appendChild(bubble)
      messageInput.value = ""
      chatBody.scrollTop = chatBody.scrollHeight
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove a classe 'active' de todas as abas e conteúdos
      tabs.forEach((t) => t.classList.remove("active"))
      contents.forEach((c) => c.classList.remove("active"))

      // Adiciona a classe 'active' apenas na aba clicada
      tab.classList.add("active")

      // Mostra o conteúdo correspondente
      const targetId = tab.id.replace("-tab", "")
      document.getElementById(targetId).classList.add("active")

      // Gerencia a visibilidade do botão de postagem
      showCorrectBtn()

      // Esconde a janela de chat quando muda de aba
      chatWindow.classList.remove("active")
    })
  })

  // Event listener para os itens da lista de chat
  chatItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const chatId = item.getAttribute("data-chat-id")
      const chatTitle = item.querySelector(".font-bold").textContent

      // Esconde a lista de mensagens
      document.getElementById("messages").classList.remove("active")

      // Mostra a janela de chat
      chatWindow.classList.add("active")
      chatName.textContent = chatTitle

      renderMessages(chatId)
    })
  })

  // Event listener para o botão de voltar
  backBtn.addEventListener("click", () => {
    chatWindow.classList.remove("active")
    document.getElementById("messages").classList.add("active")
  })

  // Event listener para o botão de enviar mensagem
  sendBtn.addEventListener("click", sendMessage)
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })

  // Adiciona a funcionalidade de curtir posts estilo Twitter
  likeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const postId = btn.closest(".post").dataset.postId
      const likesCountSpan = btn.querySelector(".likes-count")
      const svgPath = btn.querySelector("svg path")
      const isLiked = btn.dataset.liked === "true"

      if (!isLiked) {
        posts[postId].likes++
        btn.dataset.liked = "true"
        btn.classList.remove("text-gray-400")
        btn.classList.add("text-red-500")
        svgPath.setAttribute("fill", "currentColor")
      } else {
        posts[postId].likes--
        btn.dataset.liked = "false"
        btn.classList.remove("text-red-500")
        btn.classList.add("text-gray-400")
        svgPath.setAttribute("fill", "none")
      }
      likesCountSpan.textContent = posts[postId].likes
    })
  })

  // Chama a função para garantir que o botão está visível ao carregar a página
  showCorrectBtn()
})
