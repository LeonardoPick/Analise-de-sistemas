document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen")
  const loginForm = document.getElementById("login-form")
  const loginError = document.getElementById("login-error")
  const mainHeader = document.getElementById("main-header")
  const mainContent = document.getElementById("main-content")
  const mainNav = document.getElementById("main-nav")
  const addPostBtn = document.getElementById("add-post-btn")
  const floatingMenu = document.getElementById("floating-menu")
  const addPostOption = document.getElementById("add-post-option")
  const addWarningOption = document.getElementById("add-warning-option")
  const addNoticeOption = document.getElementById("add-notice-option")
  const warningsSection = document.getElementById("warnings-section")
  const warningsList = document.getElementById("warnings-list")
  const addWarningScreen = document.getElementById("add-warning-screen")
  const warningForm = document.getElementById("warning-form")
  const cancelWarningBtn = document.getElementById("cancel-warning-btn")
  const addPostScreen = document.getElementById("add-post-screen")
  const postForm = document.getElementById("post-form")
  const cancelPostBtn = document.getElementById("cancel-post-btn")
  const addNoticeScreen = document.getElementById("add-notice-screen")
  const noticeForm = document.getElementById("notice-form")
  const cancelNoticeBtn = document.getElementById("cancel-notice-btn")
  const feedContainer = document.getElementById("feed-container")
  const tabs = document.querySelectorAll(".btn-tab")
  const contents = document.querySelectorAll(".tab-content")
  const chatWindow = document.getElementById("chat-window")
  const chatBody = document.getElementById("chat-body")
  const chatName = document.getElementById("chat-name")
  const backBtn = document.getElementById("back-to-messages")
  const messageInput = document.getElementById("message-input")
  const sendBtn = document.getElementById("send-btn")
  const chatListContainer = document.getElementById("chat-list-container")
  const exploreNavBtns = document.querySelectorAll(".explore-nav-btn")
  const exploreContents = document.querySelectorAll(".explore-content")
  const residentsList = document.getElementById("residents-list")
  const servicesList = document.getElementById("services-list")
  const marketplaceList = document.getElementById("marketplace-list")
  const addServiceBtnExplore = document.getElementById(
    "add-service-btn-explore"
  )
  const addMarketplaceBtnExplore = document.getElementById(
    "add-marketplace-btn-explore"
  )
  const editProfileBtn = document.getElementById("edit-profile-btn")
  const editProfileScreen = document.getElementById("edit-profile-screen")
  const editProfileForm = document.getElementById("edit-profile-form")
  const cancelEditProfileBtn = document.getElementById(
    "cancel-edit-profile-btn"
  )
  const backToExploreBtn = document.getElementById("back-to-explore-btn")
  const sendMessageFromProfileBtn = document.getElementById(
    "send-message-from-profile-btn"
  )
  const addServiceScreen = document.getElementById("add-service-screen")
  const addServiceForm = document.getElementById("add-service-form")
  const cancelServiceBtn = document.getElementById("cancel-service-btn")
  const addMarketplaceScreen = document.getElementById("add-marketplace-screen")
  const addMarketplaceForm = document.getElementById("add-marketplace-form")
  const cancelMarketplaceBtn = document.getElementById("cancel-marketplace-btn")
  const reservationsListEl = document.getElementById("reservations-list")
  const reservationModal = document.getElementById("reservation-modal")
  const closeReservationModalBtn = document.getElementById(
    "close-reservation-modal"
  )
  const reservationAreaName = document.getElementById("reservation-area-name")
  const monthYearEl = document.getElementById("month-year")
  const calendarDaysEl = document.getElementById("calendar-days")
  const prevMonthBtn = document.getElementById("prev-month-btn")
  const nextMonthBtn = document.getElementById("next-month-btn")

  let currentUserRole = "morador"
  let currentUser = {}
  let currentChatHistory = {}
  let currentOpenChatId = null
  let currentCalendarDate = new Date()
  let currentReservationAreaId = null

  const posts = {
    1: { likes: 25, isLiked: false },
    2: { likes: 12, isLiked: false },
    3: { likes: 30, isLiked: false },
    4: { likes: 8, isLiked: false },
  }

  const comments = {
    1: [
      { user: "João", text: "Ficou ótimo! Parabéns pela iniciativa." },
      { user: "Ana", text: "Já testei e aprovei! Muito bom." },
    ],
    2: [
      { user: "Maria", text: "Posso te emprestar a minha! Me chama no chat." },
    ],
    3: [
      {
        user: "Paula",
        text: "O jardineiro é incrível! Ele se dedica muito ao condomínio.",
      },
    ],
    4: [{ user: "Síndico", text: "Excelente iniciativa para a comunidade!" }],
  }

  const chatHistoryAdmin = {
    "res-1": {
      name: "Maria Silva (Apto 302)",
      initials: "M",
      borderColor: "border-indigo-400",
      messages: [
        {
          sender: "received",
          text: "Olá, a encomenda que chegou para o apto 302 já pode ser retirada na portaria.",
          timestamp: new Date("2025-09-19T14:30:00"),
        },
        {
          sender: "sent",
          text: "Certo, vou pedir para ela descer. Obrigado!",
          timestamp: new Date("2025-09-19T14:31:00"),
        },
      ],
    },
    "res-2": {
      name: "João Silva (Apto 101)",
      initials: "J",
      borderColor: "border-purple-400",
      messages: [
        {
          sender: "received",
          text: "Recebi uma notificação de barulho, poderiam verificar por favor?",
          timestamp: new Date("2025-09-20T10:00:00"),
        },
      ],
    },
  }

  const chatHistoryResident = {
    admin: {
      name: "Administração",
      initials: "A",
      borderColor: "border-slate-500",
      messages: [
        {
          sender: "sent",
          text: "Bom dia, gostaria de saber se a manutenção do elevador já foi concluída.",
          timestamp: new Date("2025-09-18T09:00:00"),
        },
        {
          sender: "received",
          text: "Bom dia! Sim, os serviços foram finalizados e o elevador já está operando normalmente.",
          timestamp: new Date("2025-09-18T09:05:00"),
        },
      ],
    },
    "res-2": {
      name: "João Silva (Apto 101)",
      initials: "J",
      borderColor: "border-purple-400",
      messages: [
        {
          sender: "received",
          text: "Olá vizinha! Vi seu post, posso te emprestar minha furadeira sim.",
          timestamp: new Date("2025-09-20T11:00:00"),
        },
        {
          sender: "sent",
          text: "Sério? Muito obrigada, João! Salvasse meu dia!",
          timestamp: new Date("2025-09-20T11:01:00"),
        },
      ],
    },
  }

  const userWarnings = [
    {
      id: 1,
      reason: "Barulho alto após 22h",
      date: "15/10/2023",
      imageUrl:
        "https://placehold.co/400x300/f87171/ffffff?text=Evid%C3%AAncia",
    },
    { id: 2, reason: "Descarte irregular de lixo", date: "20/10/2025" },
  ]

  let officialNotices = [
    {
      id: "notice-1",
      title: "Manutenção programada nos elevadores",
      text: "Quarta-feira (28) das 10h às 12h. Pedimos que programem suas saídas.",
      date: "28/11/2025",
    },
  ]

  let reservationsData = {
    "salao-festas": {
      name: "Salão de Festas",
      bookings: [
        { date: "2025-11-10", userId: "res-3" },
        { date: "2025-11-22", userId: "res-4" },
        { date: "2025-11-15", userId: "res-1" },
      ],
    },
    churrasqueira: {
      name: "Churrasqueira",
      bookings: [
        { date: "2025-11-12", userId: "res-2" },
        { date: "2025-11-05", userId: "res-5" },
        { date: "2025-11-13", userId: "res-6" },
      ],
    },
    quadra: {
      name: "Quadra Poliesportiva",
      bookings: [
        { date: "2025-11-18", userId: "res-7" },
        { date: "2025-11-25", userId: "res-8" },
        { date: "2025-11-19", userId: "res-1" },
      ],
    },
  }

  let residentsData = [
    {
      id: "res-1",
      name: "Maria Silva",
      apartment: "Apto 302",
      initials: "M",
      borderColor: "border-indigo-400",
      colorHex: "#818cf8",
      phone: "(51) 99876-5432",
      email: "maria.silva@email.com",
      emergencyContact: { name: "Ana Silva (Irmã)", phone: "(51) 99876-1111" },
      vehicles: [
        { make: "Honda", model: "Civic", color: "Preto", plate: "IVX-4321" },
        { make: "Honda", model: "Biz", color: "Vermelha", plate: "IWW-1234" },
      ],
    },
    {
      id: "res-2",
      name: "João Silva",
      apartment: "Apto 101",
      initials: "J",
      borderColor: "border-purple-400",
      colorHex: "#a78bfa",
      phone: "(51) 98765-4321",
      email: "joao.silva@email.com",
      emergencyContact: {
        name: "Carlos Silva (Pai)",
        phone: "(51) 98765-0000",
      },
      vehicles: [
        {
          make: "Chevrolet",
          model: "Onix",
          color: "Branco",
          plate: "JDB-2020",
        },
      ],
    },
    {
      id: "res-3",
      name: "Carlos",
      apartment: "Apto 502",
      initials: "C",
      borderColor: "border-blue-400",
      colorHex: "#60a5fa",
    },
    {
      id: "res-4",
      name: "Ana Souza",
      apartment: "Apto 405",
      initials: "A",
      borderColor: "border-emerald-400",
      colorHex: "#34d399",
    },
    {
      id: "res-5",
      name: "Vania",
      apartment: "Apto 205",
      initials: "V",
      borderColor: "border-rose-400",
      colorHex: "#fb7185",
    },
    {
      id: "res-6",
      name: "Larissa",
      apartment: "Apto 603",
      initials: "L",
      borderColor: "border-gray-400",
      colorHex: "#9ca3af",
    },
    {
      id: "res-7",
      name: "Ricardo",
      apartment: "Apto 701",
      initials: "R",
      borderColor: "border-amber-400",
      colorHex: "#facc15",
    },
    {
      id: "res-8",
      name: "Pedro",
      apartment: "Apto 102",
      initials: "P",
      borderColor: "border-cyan-400",
      colorHex: "#22d3ee",
    },
  ]

  let servicesData = [
    {
      id: "serv-1",
      ownerId: "admin-user",
      title: "Serviço de Limpeza",
      provider: "Equipe de Limpeza",
      description:
        "Limpeza de apartamentos e áreas comuns. Orçamento sem compromisso.",
    },
    {
      id: "serv-2",
      ownerId: "res-7",
      title: "Aulas de Violão",
      provider: "Ricardo (Apto 701)",
      description:
        "Aulas particulares de violão para iniciantes e intermediários.",
    },
    {
      id: "serv-3",
      ownerId: "res-8",
      title: "Manutenção de Computadores",
      provider: "Pedro (Apto 102)",
      description: "Formatação, remoção de vírus e reparos em geral.",
    },
  ]

  let marketplaceData = [
    {
      id: "mp-1",
      ownerId: "res-1",
      title: "Bicicleta Usada",
      description:
        "Bicicleta de trilha semi-nova, ideal para passeios no parque.",
      price: "R$ 450,00",
      imageUrl: "https://placehold.co/400x300/60a5fa/ffffff?text=Bicicleta",
    },
    {
      id: "mp-2",
      ownerId: "res-2",
      title: "Cadeira de Escritório",
      description: "Cadeira ergonômica com pouco uso, excelente estado.",
      price: "R$ 200,00",
      imageUrl: "https://placehold.co/400x300/f87171/ffffff?text=Cadeira",
    },
    {
      id: "mp-3",
      ownerId: "admin-user",
      title: "Livros de Estudo",
      description: "Diversos livros de programação e design, vendo ou troco.",
      price: "R$ 80,00",
      imageUrl: "https://placehold.co/400x300/34d399/ffffff?text=Livros",
    },
  ]

  let activeExploreSubTab = "residents"

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    let loggedIn = false
    if (username === "admin" && password === "admin") {
      currentUserRole = "admin"
      currentUser = {
        id: "admin-user",
        name: "Administrador",
        apartment: "Condomínio",
        initials: "A",
        borderColor: "border-slate-500",
        colorHex: "#64748b",
      }
      currentChatHistory = chatHistoryAdmin
      showAdminFeatures()
      loggedIn = true
    } else if (username === "morador" && password === "123") {
      currentUserRole = "morador"
      currentUser = residentsData.find((resident) => resident.id === "res-1")
      currentChatHistory = chatHistoryResident
      showUserFeatures()
      loggedIn = true
    }

    if (loggedIn) {
      loginScreen.style.display = "none"
      mainHeader.classList.remove("hidden")
      mainContent.classList.remove("hidden")
      mainNav.classList.remove("hidden")
      addDeleteButtonsToExistingPosts()
      renderMarketplace()
      renderServices()
      renderChatList()
      renderReservationsList()
      goToTab("home")
    } else {
      loginError.style.display = "block"
    }
  })

  function goToTab(tabId, options = {}) {
    tabs.forEach((t) => t.classList.remove("active"))
    contents.forEach((c) => c.classList.remove("active"))
    document.getElementById(`${tabId}-tab`).classList.add("active")
    document.getElementById(tabId).classList.add("active")
    ;[
      addPostScreen,
      addWarningScreen,
      addNoticeScreen,
      addServiceScreen,
      addMarketplaceScreen,
      editProfileScreen,
      reservationModal,
    ].forEach((screen) => (screen.style.display = "none"))
    mainHeader.classList.remove("hidden")
    mainContent.classList.remove("hidden")
    mainNav.classList.remove("hidden")

    const profileTitle = document.querySelector("#profile > h2")
    const mainProfileCard = document.querySelector("#profile > .bg-gray-800")
    const activitySection = document.getElementById("profile-activity-section")
    const warningsSection = document.getElementById("warnings-section")

    if (tabId === "profile") {
      const userIdToView = options.userId || currentUser.id
      const isOwnProfile = userIdToView === currentUser.id

      const userToViewDetails =
        residentsData.find((res) => res.id === userIdToView) ||
        (userIdToView === "admin-user"
          ? {
              id: "admin-user",
              name: "Administração",
              apartment: "Condomínio",
              initials: "A",
              borderColor: "border-slate-500",
              colorHex: "#64748b",
            }
          : null)
      if (!userToViewDetails) return

      mainProfileCard.style.display = "flex"
      profileTitle.textContent = isOwnProfile
        ? "Perfil"
        : `Perfil de ${userToViewDetails.name}`
      document.getElementById("user-name").textContent = userToViewDetails.name
      document.getElementById("user-apartment").textContent =
        userToViewDetails.apartment
      const profileImg = mainProfileCard.querySelector("img")
      const colorClasses = residentsData
        .map((r) => r.borderColor)
        .concat(["border-slate-500"])
      profileImg.classList.remove(...colorClasses)
      profileImg.classList.add(userToViewDetails.borderColor)
      profileImg.src = `https://placehold.co/100x100/${userToViewDetails.colorHex.substring(
        1
      )}/ffffff?text=${userToViewDetails.initials}`

      sendMessageFromProfileBtn.style.display = isOwnProfile ? "none" : "flex"
      sendMessageFromProfileBtn.dataset.userId = userIdToView

      const isCurrentUserAdmin = currentUserRole === "admin"
      editProfileBtn.style.display =
        isOwnProfile && !isCurrentUserAdmin ? "block" : "none"
      backToExploreBtn.style.display = isOwnProfile ? "none" : "block"

      renderProfileDetails(userIdToView)

      activitySection.style.display =
        isOwnProfile && !isCurrentUserAdmin ? "block" : "none"
      warningsSection.style.display =
        isOwnProfile && !isCurrentUserAdmin ? "block" : "none"

      if (isOwnProfile && !isCurrentUserAdmin) {
        renderWarnings()
      }
    } else if (tabId === "home") {
      showCorrectBtn()
    } else if (tabId === "explore") {
      const subTab = options.subTab || "residents"
      renderExploreContent(subTab)
    }
  }

  function showAdminFeatures() {
    addPostBtn.classList.remove("hidden")
    addPostBtn.classList.remove("bg-indigo-600")
    addPostBtn.classList.add("bg-amber-500")
    addWarningOption.classList.remove("hidden")
    addNoticeOption.classList.remove("hidden")
    addPostOption.classList.add("hidden")
    renderNotices()
    addServiceBtnExplore.classList.add("hidden")
    addMarketplaceBtnExplore.classList.add("hidden")
  }

  function showUserFeatures() {
    addPostBtn.classList.remove("hidden")
    addPostBtn.classList.remove("bg-amber-500")
    addPostBtn.classList.add("bg-indigo-600")
    addWarningOption.classList.add("hidden")
    addNoticeOption.classList.add("hidden")
    addPostOption.classList.remove("hidden")
    addPostBtn.style.display = "flex"
    warningsSection.style.display = "block"
    renderNotices()
    addServiceBtnExplore.classList.remove("hidden")
    addMarketplaceBtnExplore.classList.remove("hidden")
  }

  function renderProfileDetails(userId) {
    const userDetails = residentsData.find((resident) => resident.id === userId)
    if (!userDetails) {
      document.getElementById("profile-info-section").style.display = "none"
      document.getElementById("profile-vehicles-section").style.display = "none"
      return
    }

    document.getElementById("profile-info-section").style.display = "block"
    document.getElementById("profile-vehicles-section").style.display = "block"

    const phoneEl = document.getElementById("profile-phone")
    const emailEl = document.getElementById("profile-email")
    const emergencyEl = document.getElementById("profile-emergency")

    phoneEl.innerHTML = `<span class="font-semibold">Telefone:</span> ${
      userDetails.phone || "Não informado"
    }`
    emailEl.innerHTML = `<span class="font-semibold">Email:</span> ${
      userDetails.email || "Não informado"
    }`
    if (userDetails.emergencyContact && userDetails.emergencyContact.name) {
      emergencyEl.innerHTML = `<span class="font-semibold">Contato de Emergência:</span> ${userDetails.emergencyContact.name} - ${userDetails.emergencyContact.phone}`
    } else {
      emergencyEl.innerHTML = `<span class="font-semibold">Contato de Emergência:</span> Não informado`
    }
    const vehiclesListEl = document.getElementById("vehicles-list")
    vehiclesListEl.innerHTML = ""
    if (userDetails.vehicles && userDetails.vehicles.length > 0) {
      userDetails.vehicles.forEach((vehicle) => {
        const li = document.createElement("li")
        li.className = "p-2 rounded-md bg-gray-700 text-sm"
        li.innerHTML = `<p><span class="font-semibold">${vehicle.make} ${vehicle.model}</span> (${vehicle.color})</p><p class="text-xs text-gray-400">Placa: ${vehicle.plate}</p>`
        vehiclesListEl.appendChild(li)
      })
    } else {
      vehiclesListEl.innerHTML = `<li class="text-sm text-gray-400">Nenhum veículo cadastrado.</li>`
    }
  }

  function populateEditProfileForm() {
    const userDetails = residentsData.find((res) => res.id === currentUser.id)
    if (!userDetails) return
    document.getElementById("edit-phone").value = userDetails.phone || ""
    document.getElementById("edit-email").value = userDetails.email || ""
    if (userDetails.emergencyContact) {
      document.getElementById("edit-emergency-name").value =
        userDetails.emergencyContact.name || ""
      document.getElementById("edit-emergency-phone").value =
        userDetails.emergencyContact.phone || ""
    } else {
      document.getElementById("edit-emergency-name").value = ""
      document.getElementById("edit-emergency-phone").value = ""
    }
    const editVehiclesList = document.getElementById("edit-vehicles-list")
    editVehiclesList.innerHTML = ""
    if (userDetails.vehicles && userDetails.vehicles.length > 0) {
      userDetails.vehicles.forEach((vehicle, index) => {
        const vehicleDiv = document.createElement("div")
        vehicleDiv.className = "p-3 border border-gray-700 rounded-md relative"
        vehicleDiv.innerHTML = `<button type="button" class="delete-vehicle-btn absolute top-2 right-2 text-gray-500 hover:text-red-400" data-index="${index}"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.234 21H7.766a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button><p class="text-sm font-semibold mb-2 text-gray-300">Veículo ${
          index + 1
        }</p><div class="grid grid-cols-2 gap-2"><div><label class="text-xs text-gray-400">Marca</label><input type="text" value="${
          vehicle.make
        }" data-index="${index}" data-field="make" class="vehicle-edit-input mt-1 w-full px-2 py-1 rounded-lg bg-gray-600 text-gray-200 text-sm"></div><div><label class="text-xs text-gray-400">Modelo</label><input type="text" value="${
          vehicle.model
        }" data-index="${index}" data-field="model" class="vehicle-edit-input mt-1 w-full px-2 py-1 rounded-lg bg-gray-600 text-gray-200 text-sm"></div><div><label class="text-xs text-gray-400">Cor</label><input type="text" value="${
          vehicle.color
        }" data-index="${index}" data-field="color" class="vehicle-edit-input mt-1 w-full px-2 py-1 rounded-lg bg-gray-600 text-gray-200 text-sm"></div><div><label class="text-xs text-gray-400">Placa</label><input type="text" value="${
          vehicle.plate
        }" data-index="${index}" data-field="plate" class="vehicle-edit-input mt-1 w-full px-2 py-1 rounded-lg bg-gray-600 text-gray-200 text-sm"></div></div>`
        editVehiclesList.appendChild(vehicleDiv)
      })
    }
    const addVehicleBtn = document.createElement("button")
    addVehicleBtn.type = "button"
    addVehicleBtn.id = "add-vehicle-btn"
    addVehicleBtn.className =
      "w-full mt-4 bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-indigo-400 transition-colors"
    addVehicleBtn.textContent = "+ Adicionar Novo Veículo"
    editVehiclesList.appendChild(addVehicleBtn)
  }

  function renderWarnings() {
    warningsList.innerHTML = ""
    if (userWarnings.length === 0) {
      warningsList.innerHTML =
        '<li class="text-sm text-gray-400">Nenhuma advertência registrada.</li>'
    } else {
      userWarnings.forEach((warning) => {
        const li = document.createElement("li")
        li.className = "p-2 rounded-md bg-gray-700 space-y-2"
        let imageHtml = ""
        if (warning.imageUrl) {
          imageHtml = `<img src="${warning.imageUrl}" alt="Evidência da advertência" class="w-full rounded-md mt-2">`
        }
        li.innerHTML = `<div class="flex justify-between items-center"><span>${warning.reason}</span><span class="text-xs text-gray-400">${warning.date}</span></div>${imageHtml}`
        warningsList.appendChild(li)
      })
    }
  }

  function createNewPost(text, imageUrl) {
    const newPostId = "post-" + Date.now()
    posts[newPostId] = { likes: 0, isLiked: false }
    comments[newPostId] = []
    const newPostElement = document.createElement("div")
    newPostElement.className = "post bg-gray-800 rounded-lg shadow-sm p-4 mb-4"
    newPostElement.dataset.postId = newPostId
    newPostElement.dataset.ownerId = currentUser.id
    let imageHtml = ""
    if (imageUrl) {
      imageHtml = `<img src="${imageUrl}" alt="Imagem da Publicação" class="w-full rounded-md mb-3">`
    }
    const deleteBtnHtml = `<button class="delete-post-btn text-gray-400 hover:text-red-500 ml-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.234 21H7.766a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>`
    newPostElement.innerHTML = `<div class="post-header flex items-start mb-2"><img src="https://placehold.co/40x40/${currentUser.colorHex.substring(
      1
    )}/ffffff?text=${
      currentUser.initials
    }" alt="Foto de Perfil do Usuário" class="rounded-full mr-3 border-2 ${
      currentUser.borderColor
    } flex-shrink-0"><div class="flex-grow"><p class="font-bold text-gray-200">${
      currentUser.name
    } <span class="text-sm text-gray-400 font-normal">・ Agora</span></p><p class="text-xs text-gray-400">${
      currentUser.apartment
    }</p></div>${deleteBtnHtml}</div><p class="text-gray-300 mb-3">${text}</p>${imageHtml}<div class="flex items-center space-x-4 text-gray-400"><button class="like-btn flex items-center space-x-1 hover:text-indigo-400" data-liked="false"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg><span class="likes-count">0</span></button><button class="comment-btn flex items-center space-x-1 hover:text-indigo-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span class="comment-count">0</span></button></div><div class="comments-section" data-post-id="${newPostId}"><div class="comments-list mt-2 space-y-2 text-sm text-gray-400"></div><div class="add-comment-form mt-2 flex items-center space-x-2"><input type="text" class="comment-input w-full px-4 py-2 rounded-full bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Escreva um comentário..."><button class="send-comment-btn bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-500 transition-colors duration-300"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button></div></div>`

    const existingNotices = feedContainer.querySelectorAll(".official-notice")
    if (existingNotices.length > 0) {
      const lastNotice = existingNotices[existingNotices.length - 1]
      lastNotice.insertAdjacentElement("afterend", newPostElement)
    } else {
      feedContainer.insertBefore(newPostElement, feedContainer.firstChild)
    }

    setupDynamicEventListeners()
  }

  function showCorrectBtn() {
    if (document.getElementById("home").classList.contains("active")) {
      addPostBtn.style.display = "flex"
      floatingMenu.style.display = "none"
    } else {
      addPostBtn.style.display = "none"
    }
  }

  function renderChatList() {
    chatListContainer.innerHTML = ""

    const chatListArray = Object.keys(currentChatHistory).map((chatId) => {
      return { id: chatId, ...currentChatHistory[chatId] }
    })

    chatListArray.sort((a, b) => {
      const lastMsgA = a.messages[a.messages.length - 1]
      const lastMsgB = b.messages[b.messages.length - 1]
      if (!lastMsgA) return 1
      if (!lastMsgB) return -1
      return lastMsgB.timestamp - lastMsgA.timestamp
    })

    chatListArray.forEach((chat) => {
      const lastMessage =
        chat.messages[chat.messages.length - 1]?.text ||
        "Nenhuma mensagem ainda."
      const chatElement = document.createElement("div")
      chatElement.className =
        "chat-item flex items-center p-3 rounded-lg bg-gray-800 shadow-sm hover:bg-gray-700 cursor-pointer"
      chatElement.dataset.chatId = chat.id

      const contactDetails =
        residentsData.find((r) => r.id === chat.id) ||
        (chat.id === "admin"
          ? { colorHex: "#64748b" }
          : { colorHex: "#64748b" })

      chatElement.innerHTML = `
                    <img src="https://placehold.co/50x50/${contactDetails.colorHex.substring(
                      1
                    )}/ffffff?text=${
        chat.initials
      }" alt="Foto de Perfil" class="rounded-full mr-4 border-2 ${
        chat.borderColor
      }">
                    <div>
                        <p class="font-bold text-gray-200">${chat.name}</p>
                        <p class="text-sm text-gray-400 truncate">${lastMessage}</p>
                    </div>
                `
      chatListContainer.appendChild(chatElement)
    })

    setupChatListListeners()
  }

  function setupChatListListeners() {
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.addEventListener("click", () => {
        const chatId = item.dataset.chatId
        currentOpenChatId = chatId
        const chatTitle = currentChatHistory[chatId].name
        document.getElementById("messages").classList.remove("active")
        chatWindow.classList.add("active")
        chatName.textContent = chatTitle
        renderMessages(chatId)
      })
    })
  }

  function renderMessages(chatId) {
    chatBody.innerHTML = ""
    const messages = currentChatHistory[chatId].messages
    messages.forEach((msg) => {
      const bubble = document.createElement("div")
      bubble.classList.add("message-bubble", msg.sender)
      bubble.textContent = msg.text
      chatBody.appendChild(bubble)
    })
    chatBody.scrollTop = chatBody.scrollHeight
  }

  function sendMessage() {
    const text = messageInput.value.trim()
    if (text && currentOpenChatId) {
      const bubble = document.createElement("div")
      bubble.classList.add("message-bubble", "sent")
      bubble.textContent = text
      chatBody.appendChild(bubble)

      const newMessage = { sender: "sent", text: text, timestamp: new Date() }
      currentChatHistory[currentOpenChatId].messages.push(newMessage)

      renderChatList()

      messageInput.value = ""
      chatBody.scrollTop = chatBody.scrollHeight
    }
  }

  function renderComments(postId) {
    const commentsList = document.querySelector(
      `.comments-section[data-post-id="${postId}"] .comments-list`
    )
    commentsList.innerHTML = ""
    if (comments[postId] && comments[postId].length > 0) {
      comments[postId].forEach((comment) => {
        const commentElement = document.createElement("div")
        commentElement.className = "p-2 rounded-md bg-gray-700"
        commentElement.innerHTML = `<p class="font-semibold text-gray-300">${comment.user}</p><p>${comment.text}</p>`
        commentsList.appendChild(commentElement)
      })
    } else {
      commentsList.innerHTML =
        '<p class="text-xs text-gray-500">Nenhum comentário ainda.</p>'
    }
  }

  function addComment(postId, commentText) {
    if (commentText.trim() === "") return
    const newComment = { user: currentUser.name, text: commentText }
    if (!comments[postId]) {
      comments[postId] = []
    }
    comments[postId].push(newComment)
    const postElement = document.querySelector(
      `.post[data-post-id="${postId}"]`
    )
    const commentCountSpan = postElement.querySelector(".comment-count")
    commentCountSpan.textContent = comments[postId].length
    renderComments(postId)
  }

  function renderNotices() {
    document.querySelectorAll(".official-notice").forEach((el) => el.remove())
    officialNotices.forEach((notice) => {
      const noticeElement = document.createElement("div")
      noticeElement.id = notice.id
      noticeElement.className =
        "official-notice bg-gray-800 rounded-lg shadow-sm p-4 mb-4 border-l-4 border-indigo-500 flex justify-between items-start"
      const deleteBtnHtml =
        currentUserRole === "admin"
          ? `<button class="delete-notice-btn text-gray-400 hover:text-red-500 ml-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.234 21H7.766a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>`
          : ""
      noticeElement.innerHTML = `<div><span class="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">Comunicado Oficial</span><h3 class="text-lg font-bold text-gray-200 mt-2">${notice.title}</h3><p class="text-sm text-gray-300">${notice.text}</p></div>${deleteBtnHtml}`
      feedContainer.prepend(noticeElement)
    })
    setupDynamicEventListeners()
  }

  function renderExploreContent(tab) {
    exploreContents.forEach((content) => content.classList.remove("active"))
    exploreNavBtns.forEach((btn) =>
      btn.classList.remove("bg-indigo-600", "text-white")
    )
    exploreNavBtns.forEach((btn) =>
      btn.classList.add("bg-gray-700", "text-gray-300")
    )
    let targetContent
    if (tab === "residents") {
      targetContent = document.getElementById("residents-content")
      renderResidents()
    } else if (tab === "services") {
      targetContent = document.getElementById("services-content")
      renderServices()
    } else {
      targetContent = document.getElementById("marketplace-content")
      renderMarketplace()
    }
    targetContent.classList.add("active")
    document
      .getElementById(`${tab}-tab-explore`)
      .classList.add("bg-indigo-600", "text-white")
    document
      .getElementById(`${tab}-tab-explore`)
      .classList.remove("bg-gray-700", "text-gray-300")
  }

  function renderResidents() {
    residentsList.innerHTML = ""
    residentsData.forEach((resident) => {
      const residentElement = document.createElement("div")
      residentElement.className =
        "resident-card bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-700 transition-colors"
      residentElement.dataset.residentId = resident.id
      residentElement.innerHTML = `<img src="https://placehold.co/50x50/${resident.colorHex.substring(
        1
      )}/ffffff?text=${
        resident.initials
      }" alt="Foto de Perfil" class="rounded-full border-2 ${
        resident.borderColor
      } pointer-events-none"><div class="pointer-events-none"><p class="font-bold text-gray-200">${
        resident.name
      }</p><p class="text-sm text-gray-400">${resident.apartment}</p></div>`
      residentsList.appendChild(residentElement)
    })
  }

  function renderServices() {
    servicesList.innerHTML = ""
    servicesData.forEach((service) => {
      const serviceElement = document.createElement("div")
      serviceElement.id = `service-${service.id}`
      serviceElement.className =
        "service-item bg-gray-800 rounded-lg shadow-sm p-4 flex justify-between items-start"
      const deleteBtnHtml =
        currentUserRole === "admin" || currentUser.id === service.ownerId
          ? `<button class="delete-item-btn text-gray-400 hover:text-red-500 ml-4" data-item-id="${service.id}" data-item-type="service"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.234 21H7.766a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>`
          : ""
      serviceElement.innerHTML = `<div><p class="font-bold text-gray-200">${service.title}</p><p class="text-sm text-gray-400 mt-1">Fornecedor: ${service.provider}</p><p class="text-sm text-gray-300 mt-2">${service.description}</p></div>${deleteBtnHtml}`
      servicesList.appendChild(serviceElement)
    })
    setupDynamicEventListeners()
  }

  function renderMarketplace() {
    marketplaceList.innerHTML = ""
    marketplaceData.forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.id = `marketplace-${item.id}`
      itemElement.className =
        "marketplace-item bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col relative"
      const deleteBtnHtml =
        currentUserRole === "admin" || currentUser.id === item.ownerId
          ? `<button class="delete-item-btn text-white hover:text-red-400 absolute top-2 right-2 bg-gray-900 bg-opacity-50 rounded-full p-1" data-item-id="${item.id}" data-item-type="marketplace"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.234 21H7.766a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>`
          : ""
      itemElement.innerHTML = `<img src="${item.imageUrl}" alt="${item.title}" class="w-full h-32 object-cover"><div class="p-3 flex-grow"><p class="font-bold text-gray-200">${item.title}</p><p class="text-sm text-indigo-400 mt-1">${item.price}</p><p class="text-xs text-gray-400 mt-2">${item.description}</p></div>${deleteBtnHtml}`
      marketplaceList.appendChild(itemElement)
    })
    setupDynamicEventListeners()
  }

  function setupDynamicEventListeners() {
    document
      .querySelectorAll(".like-btn")
      .forEach((btn) => btn.removeEventListener("click", handleLike))
    document
      .querySelectorAll(".comment-btn")
      .forEach((btn) => btn.removeEventListener("click", handleCommentClick))
    document
      .querySelectorAll(".send-comment-btn")
      .forEach((btn) => btn.removeEventListener("click", handleSendComment))
    document
      .querySelectorAll(".comment-input")
      .forEach((input) =>
        input.removeEventListener("keypress", handleSendCommentOnEnter)
      )
    document
      .querySelectorAll(".delete-notice-btn")
      .forEach((btn) => btn.removeEventListener("click", handleDeleteNotice))
    document
      .querySelectorAll(".delete-item-btn")
      .forEach((btn) => btn.removeEventListener("click", handleDeleteItem))
    document
      .querySelectorAll(".delete-post-btn")
      .forEach((btn) => btn.removeEventListener("click", handleDeletePost))
    document
      .querySelectorAll(".like-btn")
      .forEach((btn) => btn.addEventListener("click", handleLike))
    document
      .querySelectorAll(".comment-btn")
      .forEach((btn) => btn.addEventListener("click", handleCommentClick))
    document
      .querySelectorAll(".send-comment-btn")
      .forEach((btn) => btn.addEventListener("click", handleSendComment))
    document
      .querySelectorAll(".comment-input")
      .forEach((input) =>
        input.addEventListener("keypress", handleSendCommentOnEnter)
      )
    document
      .querySelectorAll(".delete-notice-btn")
      .forEach((btn) => btn.addEventListener("click", handleDeleteNotice))
    document
      .querySelectorAll(".delete-item-btn")
      .forEach((btn) => btn.addEventListener("click", handleDeleteItem))
    document
      .querySelectorAll(".delete-post-btn")
      .forEach((btn) => btn.addEventListener("click", handleDeletePost))
  }

  function handleLike(event) {
    const btn = event.currentTarget
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
  }

  function handleCommentClick(event) {
    const btn = event.currentTarget
    const postId = btn.closest(".post").dataset.postId
    const commentsSection = document.querySelector(
      `.comments-section[data-post-id="${postId}"]`
    )
    if (commentsSection.style.display === "block") {
      commentsSection.style.display = "none"
    } else {
      commentsSection.style.display = "block"
      renderComments(postId)
    }
  }

  function handleSendComment(event) {
    const postElement = event.currentTarget.closest(".post")
    const postId = postElement.dataset.postId
    const commentInput = postElement.querySelector(".comment-input")
    const commentText = commentInput.value
    if (commentText.trim() !== "") {
      addComment(postId, commentText)
      commentInput.value = ""
    }
  }

  function handleSendCommentOnEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSendComment(e)
    }
  }
  function handleDeleteNotice(event) {
    const noticeElement = event.currentTarget.closest(".official-notice")
    const noticeId = noticeElement.id
    officialNotices = officialNotices.filter((notice) => notice.id !== noticeId)
    noticeElement.remove()
  }
  function handleDeleteItem(event) {
    if (!confirm("Tem certeza que deseja excluir este item?")) return
    const btn = event.currentTarget
    const itemId = btn.dataset.itemId
    const itemType = btn.dataset.itemType
    if (itemType === "service") {
      servicesData = servicesData.filter((item) => item.id !== itemId)
      renderServices()
    } else if (itemType === "marketplace") {
      marketplaceData = marketplaceData.filter((item) => item.id !== itemId)
      renderMarketplace()
    }
  }
  function handleDeletePost(event) {
    const postElement = event.currentTarget.closest(".post")
    const postId = postElement.dataset.postId
    if (confirm("Tem certeza de que deseja excluir esta publicação?")) {
      postElement.remove()
      delete posts[postId]
      delete comments[postId]
    }
  }
  function addDeleteButtonsToExistingPosts() {
    document.querySelectorAll(".post").forEach((postElement) => {
      const ownerId = postElement.dataset.ownerId
      if (currentUser.id === ownerId || currentUserRole === "admin") {
        const headerDiv = postElement.querySelector(".post-header")
        if (headerDiv && !headerDiv.querySelector(".delete-post-btn")) {
          const deleteBtn = document.createElement("button")
          deleteBtn.className =
            "delete-post-btn text-gray-400 hover:text-red-500 ml-2"
          deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.234 21H7.766a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`
          headerDiv.appendChild(deleteBtn)
        }
      }
    })
    setupDynamicEventListeners()
  }

  function renderReservationsList() {
    reservationsListEl.innerHTML = ""
    for (const areaId in reservationsData) {
      const area = reservationsData[areaId]
      const li = document.createElement("li")
      li.className = "p-2 rounded-md bg-gray-700"

      const sortedBookings = [...area.bookings].sort((a, b) =>
        a.date.localeCompare(b.date)
      )

      const reservedDatesHtml = sortedBookings
        .map((booking) => {
          const [year, month, day] = booking.date.split("-")
          return `${day}/${month}`
        })
        .join(", ")

      li.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <span>${area.name}</span>
                        <button class="reserve-btn bg-indigo-600 text-white px-3 py-1 text-sm rounded-md hover:bg-indigo-500" data-area-id="${areaId}">
                            Reservar
                        </button>
                    </div>
                    <div class="border-t border-gray-600 pt-2">
                        <p class="text-xs text-gray-400 font-semibold mb-1">Datas Reservadas:</p>
                        <span class="text-sm text-red-400">${
                          reservedDatesHtml || "Nenhuma data reservada"
                        }</span>
                    </div>
                `
      reservationsListEl.appendChild(li)
    }
  }

  function renderCalendar() {
    calendarDaysEl.innerHTML = ""
    const year = currentCalendarDate.getFullYear()
    const month = currentCalendarDate.getMonth()

    monthYearEl.textContent = `${currentCalendarDate.toLocaleString("pt-BR", {
      month: "long",
    })} ${year}`

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const bookings = reservationsData[currentReservationAreaId].bookings

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDaysEl.innerHTML += `<div class="calendar-day empty"></div>`
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement("div")
      dayEl.textContent = day
      dayEl.classList.add("calendar-day")
      const dateForDay = new Date(year, month, day)
      dayEl.dataset.date = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`

      if (
        day === startOfToday.getDate() &&
        month === startOfToday.getMonth() &&
        year === startOfToday.getFullYear()
      ) {
        dayEl.classList.add("today")
      }

      if (dateForDay < startOfToday) {
        dayEl.classList.add("past")
      } else {
        const bookingForDay = bookings.find(
          (b) => b.date === dayEl.dataset.date
        )
        if (bookingForDay) {
          if (bookingForDay.userId === currentUser.id) {
            dayEl.classList.add("cancellable")
          } else {
            dayEl.classList.add("reserved")
          }
        } else {
          dayEl.classList.add("available")
        }
      }
      calendarDaysEl.appendChild(dayEl)
    }
  }

  function openReservationModal(areaId) {
    currentReservationAreaId = areaId
    reservationAreaName.textContent = `Reservar: ${reservationsData[areaId].name}`
    currentCalendarDate = new Date()
    renderCalendar()
    reservationModal.style.display = "flex"
  }

  reservationsListEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("reserve-btn")) {
      const areaId = e.target.dataset.areaId
      openReservationModal(areaId)
    }
  })

  closeReservationModalBtn.addEventListener("click", () => {
    reservationModal.style.display = "none"
  })

  prevMonthBtn.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1)
    renderCalendar()
  })

  nextMonthBtn.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1)
    renderCalendar()
  })

  calendarDaysEl.addEventListener("click", (e) => {
    const clickedDay = e.target
    const date = clickedDay.dataset.date
    if (!date) return

    const [year, month, day] = date.split("-")
    const formattedDate = `${day}/${month}/${year}`

    if (clickedDay.classList.contains("available")) {
      if (
        confirm(
          `Confirmar reserva para ${reservationsData[currentReservationAreaId].name} no dia ${formattedDate}?`
        )
      ) {
        reservationsData[currentReservationAreaId].bookings.push({
          date: date,
          userId: currentUser.id,
        })
        alert("Reserva confirmada com sucesso!")
        renderReservationsList()
        renderCalendar()
      }
    } else if (clickedDay.classList.contains("cancellable")) {
      if (
        confirm(
          `Deseja cancelar sua reserva para ${reservationsData[currentReservationAreaId].name} no dia ${formattedDate}?`
        )
      ) {
        const bookings = reservationsData[currentReservationAreaId].bookings
        const indexToRemove = bookings.findIndex(
          (b) => b.date === date && b.userId === currentUser.id
        )
        if (indexToRemove > -1) {
          bookings.splice(indexToRemove, 1)
          alert("Reserva cancelada com sucesso!")
          renderReservationsList()
          renderCalendar()
        }
      }
    }
  })

  addPostBtn.addEventListener("click", () => {
    if (addPostBtn.style.display !== "none") {
      floatingMenu.style.display =
        floatingMenu.style.display === "flex" ? "none" : "flex"
    }
  })
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.id.replace("-tab", "")
      goToTab(targetId)
    })
  })
  exploreNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.id.replace("-tab-explore", "")
      goToTab("explore", { subTab: tabName })
    })
  })
  addServiceBtnExplore.addEventListener("click", () => {
    floatingMenu.style.display = "none"
    mainContent.classList.add("hidden")
    mainNav.classList.add("hidden")
    mainHeader.classList.add("hidden")
    addServiceScreen.style.display = "flex"
  })
  addMarketplaceBtnExplore.addEventListener("click", () => {
    floatingMenu.style.display = "none"
    mainContent.classList.add("hidden")
    mainNav.classList.add("hidden")
    mainHeader.classList.add("hidden")
    addMarketplaceScreen.style.display = "flex"
  })
  backBtn.addEventListener("click", () => {
    chatWindow.classList.remove("active")
    document.getElementById("messages").classList.add("active")
  })
  sendBtn.addEventListener("click", sendMessage)
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })
  addPostOption.addEventListener("click", () => {
    floatingMenu.style.display = "none"
    mainContent.classList.add("hidden")
    mainNav.classList.add("hidden")
    mainHeader.classList.add("hidden")
    addPostScreen.style.display = "flex"
  })
  addNoticeOption.addEventListener("click", () => {
    floatingMenu.style.display = "none"
    mainContent.classList.add("hidden")
    mainNav.classList.add("hidden")
    mainHeader.classList.add("hidden")
    addNoticeScreen.style.display = "flex"
  })
  addWarningOption.addEventListener("click", () => {
    floatingMenu.style.display = "none"
    mainContent.classList.add("hidden")
    mainNav.classList.add("hidden")
    mainHeader.classList.add("hidden")
    addWarningScreen.style.display = "flex"
  })
  cancelNoticeBtn.addEventListener("click", () => {
    goToTab("home")
  })
  cancelServiceBtn.addEventListener("click", () => {
    goToTab("explore", { subTab: "services" })
  })
  cancelMarketplaceBtn.addEventListener("click", () => {
    goToTab("explore", { subTab: "marketplace" })
  })
  noticeForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const noticeTitle = document.getElementById("notice-title").value
    const noticeText = document.getElementById("notice-text").value
    if (noticeTitle.trim() === "" || noticeText.trim() === "") {
      alert("Por favor, preencha todos os campos do aviso.")
      return
    }
    const newNotice = {
      id: "notice-" + Date.now(),
      title: noticeTitle,
      text: noticeText,
      date: new Date().toLocaleDateString("pt-BR"),
    }
    officialNotices.unshift(newNotice)
    renderNotices()
    alert("Novo aviso publicado com sucesso!")
    noticeForm.reset()
    goToTab("home")
  })
  addServiceForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const serviceTitle = document.getElementById("service-title").value
    const serviceDescription = document.getElementById(
      "service-description"
    ).value
    if (serviceTitle.trim() === "" || serviceDescription.trim() === "") {
      alert("Por favor, preencha todos os campos do serviço.")
      return
    }
    const newService = {
      id: `serv-${Date.now()}`,
      ownerId: currentUser.id,
      title: serviceTitle,
      provider: `${currentUser.name} (${currentUser.apartment})`,
      description: serviceDescription,
    }
    servicesData.push(newService)
    alert("Novo serviço adicionado com sucesso!")
    addServiceForm.reset()
    goToTab("explore", { subTab: "services" })
  })
  addMarketplaceForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const marketplaceTitle = document.getElementById("marketplace-title").value
    const marketplaceDescription = document.getElementById(
      "marketplace-description"
    ).value
    const marketplacePrice = document.getElementById("marketplace-price").value
    const marketplaceImageInput = document.getElementById(
      "marketplace-image-upload"
    )
    let marketplaceImageUrl = ""
    if (marketplaceImageInput.files && marketplaceImageInput.files[0]) {
      const file = marketplaceImageInput.files[0]
      marketplaceImageUrl = URL.createObjectURL(file)
    }
    if (
      marketplaceTitle.trim() === "" ||
      marketplaceDescription.trim() === "" ||
      marketplacePrice.trim() === "" ||
      marketplaceImageUrl === ""
    ) {
      alert("Por favor, preencha todos os campos, incluindo a imagem.")
      return
    }
    const newItem = {
      id: `mp-${Date.now()}`,
      ownerId: currentUser.id,
      title: marketplaceTitle,
      description: marketplaceDescription,
      price: "R$ " + marketplacePrice,
      imageUrl: marketplaceImageUrl,
    }
    marketplaceData.push(newItem)
    alert("Novo item adicionado ao marketplace com sucesso!")
    addMarketplaceForm.reset()
    goToTab("explore", { subTab: "marketplace" })
  })
  cancelWarningBtn.addEventListener("click", () => {
    goToTab("home")
  })
  warningForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const selectedTenant = document.getElementById("tenant-select").value
    const warningReason = document.getElementById("warning-reason").value
    const warningImageInput = document.getElementById("warning-image-upload")
    let warningImageUrl = ""
    if (warningImageInput.files && warningImageInput.files[0]) {
      const file = warningImageInput.files[0]
      warningImageUrl = URL.createObjectURL(file)
    }
    if (warningReason.trim() === "") {
      alert("Por favor, insira o motivo da advertência.")
      return
    }
    alert(`Advertência criada para ${selectedTenant}: "${warningReason}"`)
    userWarnings.push({
      id: userWarnings.length + 1,
      reason: warningReason,
      date: new Date().toLocaleDateString("pt-BR"),
      imageUrl: warningImageUrl || null,
    })
    warningForm.reset()
    goToTab("home")
  })
  cancelPostBtn.addEventListener("click", () => {
    goToTab("home")
  })
  postForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const postText = document.getElementById("post-text").value
    const postImageInput = document.getElementById("post-image-upload")
    let postImageUrl = ""
    if (postImageInput.files && postImageInput.files[0]) {
      const file = postImageInput.files[0]
      postImageUrl = URL.createObjectURL(file)
    }
    if (postText.trim() === "") {
      alert("Por favor, insira o texto da sua publicação.")
      return
    }
    createNewPost(postText, postImageUrl)
    postForm.reset()
    goToTab("home")
  })
  editProfileBtn.addEventListener("click", () => {
    populateEditProfileForm()
    mainContent.classList.add("hidden")
    mainNav.classList.add("hidden")
    mainHeader.classList.add("hidden")
    editProfileScreen.style.display = "block"
  })
  cancelEditProfileBtn.addEventListener("click", () => {
    editProfileScreen.style.display = "none"
    mainContent.classList.remove("hidden")
    mainNav.classList.remove("hidden")
    mainHeader.classList.remove("hidden")
    goToTab("profile")
  })
  editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const userIndex = residentsData.findIndex(
      (res) => res.id === currentUser.id
    )
    if (userIndex === -1) return
    residentsData[userIndex].phone = document.getElementById("edit-phone").value
    residentsData[userIndex].email = document.getElementById("edit-email").value
    residentsData[userIndex].emergencyContact = {
      name: document.getElementById("edit-emergency-name").value,
      phone: document.getElementById("edit-emergency-phone").value,
    }
    const vehicleInputs = document.querySelectorAll(".vehicle-edit-input")
    const updatedVehicles = []
    const numVehicles = vehicleInputs.length / 4
    for (let i = 0; i < numVehicles; i++) {
      updatedVehicles.push({
        make: document.querySelector(`[data-index="${i}"][data-field="make"]`)
          .value,
        model: document.querySelector(`[data-index="${i}"][data-field="model"]`)
          .value,
        color: document.querySelector(`[data-index="${i}"][data-field="color"]`)
          .value,
        plate: document.querySelector(`[data-index="${i}"][data-field="plate"]`)
          .value,
      })
    }
    residentsData[userIndex].vehicles = updatedVehicles
    currentUser = { ...residentsData[userIndex] }
    alert("Perfil atualizado com sucesso!")
    editProfileScreen.style.display = "none"
    mainContent.classList.remove("hidden")
    mainNav.classList.remove("hidden")
    mainHeader.classList.remove("hidden")
    goToTab("profile")
  })
  document
    .getElementById("edit-vehicles-list")
    .addEventListener("click", (e) => {
      const deleteButton = e.target.closest(".delete-vehicle-btn")
      const addButton = e.target.closest("#add-vehicle-btn")
      if (deleteButton) {
        const indexToDelete = parseInt(deleteButton.dataset.index, 10)
        if (
          confirm(
            `Tem certeza que deseja excluir o Veículo ${indexToDelete + 1}?`
          )
        ) {
          const userIndex = residentsData.findIndex(
            (res) => res.id === currentUser.id
          )
          if (userIndex > -1) {
            residentsData[userIndex].vehicles.splice(indexToDelete, 1)
            populateEditProfileForm()
          }
        }
      }
      if (addButton) {
        const userIndex = residentsData.findIndex(
          (res) => res.id === currentUser.id
        )
        if (userIndex > -1) {
          if (!residentsData[userIndex].vehicles) {
            residentsData[userIndex].vehicles = []
          }
          residentsData[userIndex].vehicles.push({
            make: "",
            model: "",
            color: "",
            plate: "",
          })
          populateEditProfileForm()
        }
      }
    })
  document.querySelectorAll(".post").forEach((post) => {
    const postId = post.dataset.postId
    if (comments[postId]) {
      const commentCountSpan = post.querySelector(".comment-count")
      commentCountSpan.textContent = comments[postId].length
    }
  })
  setupDynamicEventListeners()
  showCorrectBtn()
  residentsList.addEventListener("click", (e) => {
    const card = e.target.closest(".resident-card")
    if (card) {
      const residentId = card.dataset.residentId
      goToTab("profile", { userId: residentId })
    }
  })
  backToExploreBtn.addEventListener("click", () => {
    goToTab("explore", { subTab: "residents" })
  })
  feedContainer.addEventListener("click", (e) => {
    const header = e.target.closest(".post-header")
    if (header) {
      const post = header.closest(".post")
      const ownerId = post.dataset.ownerId
      if (ownerId) {
        goToTab("profile", { userId: ownerId })
      }
    }
  })

  sendMessageFromProfileBtn.addEventListener("click", (e) => {
    const targetUserId = e.currentTarget.dataset.userId
    if (!targetUserId) return

    if (!currentChatHistory[targetUserId]) {
      const targetUserDetails = residentsData.find(
        (res) => res.id === targetUserId
      )

      if (targetUserDetails) {
        currentChatHistory[targetUserId] = {
          name: `${targetUserDetails.name} (${targetUserDetails.apartment})`,
          initials: targetUserDetails.initials,
          borderColor: targetUserDetails.borderColor,
          messages: [],
        }
      } else if (targetUserId === "admin-user") {
        currentChatHistory[targetUserId] = {
          name: `Administração`,
          initials: "A",
          borderColor: "border-slate-500",
          messages: [],
        }
      }
    }

    goToTab("messages")

    if (!document.querySelector(`.chat-item[data-chat-id="${targetUserId}"]`)) {
      renderChatList()
    }

    const chatListItem = document.querySelector(
      `.chat-item[data-chat-id="${targetUserId}"]`
    )
    if (chatListItem) {
      chatListItem.click()
    }
  })
})
