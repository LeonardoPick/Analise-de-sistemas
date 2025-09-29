import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Adicionar no início do script.js, após as importações
let residentsData = [];
let userWarnings = [];
let currentUser = null;
let servicesData = [];
let marketplaceData = [];
let reservationsData = {};
let comments = {};
let officialNotices = [];
let posts = {};
let isAdm = false; // Mover para escopo global

const firebaseConfig = {
  apiKey: "***",
  authDomain: "***",
  projectId: "***",
  storageBucket: "***",
  messagingSenderId: "***",
  appId: "***",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

function initializeDefaultData() {
  // Dados de exemplo para desenvolvimento
  servicesData = [];
  marketplaceData = [];
  reservationsData = {
    churrasqueira: { name: "Churrasqueira", bookings: [] },
    salao: { name: "Salão de Festas", bookings: [] },
    piscina: { name: "Piscina", bookings: [] },
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const postsRef = collection(db, "posts");
  const noticesRef = collection(db, "notices");

  let activeExploreSubTab = "residents";

  async function registrarUsuario(
    email,
    senha,
    nome,
    foto,
    telefone,
    apartamento,
    adm
  ) {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCred.user;

      let photoURL = null;

      if (foto) {
        const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
        await uploadBytes(storageRef, foto);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        name: nome,
        photo: foto,
        apartment: apartamento,
        phone: telefone,
        emergencyContact: null,
        vehicles: [],
        role: "morador",
        adm: adm,
        createdAt: serverTimestamp(),
      });

      console.log("Usuário criado com sucesso!", user.uid);
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
    }
  }

  /*  registrarUsuario(
    "desiler751@etenx.com",
    "123456",
    "Test User",
    null,
    "(51) 1234-1234",
    "666",
    true
  );*/

  /*  document.getElementById("register-form").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("reg-email").value;
      const senha = document.getElementById("reg-password").value;
      const nome = document.getElementById("reg-name").value;
      const telefone = document.getElementById("reg-phone").value;
      const apartamento = document.getElementById("reg-apartment").value;
      const foto = document.getElementById("reg-photo").files[0];
  
      await registrarUsuario(email, senha, nome, foto, telefone, apartamento);
    });
  */

  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////LOGIN///////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////

  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Login realizado");
        document.getElementById("login-error").classList.add("hidden");
      } catch (err) {
        console.error("Erro login:", err.message);
        document.getElementById("login-error").classList.remove("hidden");
      }
    });

  async function getAdmStatus() {
    if (!auth.currentUser) return null;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return Object.prototype.hasOwnProperty.call(data, "adm")
      ? !!data.adm
      : null;
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("main-header").classList.remove("hidden");
      document.getElementById("main-content").classList.remove("hidden");
      document.getElementById("main-nav").classList.remove("hidden");

      isAdm = await getAdmStatus(); // Usar a variável global
      console.log("Status ADM:", isAdm);

      if (isAdm === true) {
        showAdminFeatures();
      } else {
        showUserFeatures();
      }
      //initializeDefaultData();
      addDeleteButtonsToExistingPosts();
      renderMarketplace();
      renderServices();
      renderChatList();
      renderReservationsList();
      goToTab("home");
    } else {
      console.log("Nenhum usuário autenticado");
      document.getElementById("login-error").style.display = "block";
    }
  });

  let currentChatHistory = {};
  let currentOpenChatId = null;
  let currentCalendarDate = new Date();
  let currentReservationAreaId = null;

  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////*******/////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////

  async function goToTab(tabId, options = {}) {
    document
      .querySelectorAll(".btn-tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));
    document.getElementById(`${tabId}-tab`).classList.add("active");
    document.getElementById(tabId).classList.add("active");
    [
      document.getElementById("add-post-screen"),
      document.getElementById("add-warning-screen"),
      document.getElementById("add-notice-screen"),
      document.getElementById("add-service-screen"),
      document.getElementById("add-marketplace-screen"),
      document.getElementById("edit-profile-screen"),
      document.getElementById("reservation-modal"),
    ].forEach((screen) => (screen.style.display = "none"));
    document.getElementById("main-header").classList.remove("hidden");
    document.getElementById("main-content").classList.remove("hidden");
    document.getElementById("main-nav").classList.remove("hidden");

    // Corrigir a parte do profile na função goToTab
    if (tabId === "profile") {
      const userIdToView = options.userId || auth.currentUser.uid;
      const isOwnProfile = userIdToView === auth.currentUser.uid;

      const userSnap = await getDoc(doc(db, "users", userIdToView));
      if (userSnap.exists()) {
        const userData = userSnap.data();

        document.getElementById("user-name").textContent =
          userData.name || "Usuário";
        document.getElementById("user-apartment").textContent = `Apto ${
          userData.apartment || "N/A"
        }`;

        // Atualizar informações do perfil
        document.getElementById(
          "profile-phone"
        ).innerHTML = `<span class="font-semibold">Telefone:</span> ${
          userData.phone || "Não informado"
        }`;
        document.getElementById(
          "profile-email"
        ).innerHTML = `<span class="font-semibold">Email:</span> ${
          userData.email || "Não informado"
        }`;

        if (userData.emergencyContact) {
          document.getElementById(
            "profile-emergency"
          ).innerHTML = `<span class="font-semibold">Contato de Emergência:</span> ${userData.emergencyContact.name} - ${userData.emergencyContact.phone}`;
        } else {
          document.getElementById(
            "profile-emergency"
          ).innerHTML = `<span class="font-semibold">Contato de Emergência:</span> Não informado`;
        }

        const vehiclesListEl = document.getElementById("vehicles-list");
        vehiclesListEl.innerHTML = "";
        if (userData.vehicles && userData.vehicles.length > 0) {
          userData.vehicles.forEach((vehicle) => {
            const li = document.createElement("li");
            li.className = "p-2 rounded-md bg-gray-700 text-sm";
            li.innerHTML = `<p><span class="font-semibold">${vehicle.make} ${vehicle.model}</span> (${vehicle.color})</p><p class="text-xs text-gray-400">Placa: ${vehicle.plate}</p>`;
            vehiclesListEl.appendChild(li);
          });
        } else {
          vehiclesListEl.innerHTML = `<li class="text-sm text-gray-400">Nenhum veículo cadastrado.</li>`;
        }

        document.getElementById("send-message-from-profile-btn").style.display =
          isOwnProfile ? "none" : "flex";
        document.getElementById(
          "send-message-from-profile-btn"
        ).dataset.userId = userIdToView;
        document.getElementById("edit-profile-btn").style.display = isOwnProfile
          ? "block"
          : "none";
        document.getElementById("back-to-explore-btn").style.display =
          isOwnProfile ? "none" : "block";
        document.getElementById("profile-activity-section").style.display =
          isOwnProfile ? "block" : "none";
        document.getElementById("warnings-section").style.display =
          isOwnProfile && !isAdm ? "block" : "none";

        if (isOwnProfile && !isAdm) {
          renderWarnings();
        }
      }
    } else if (tabId === "home") {
      showCorrectBtn();
    } else if (tabId === "explore") {
      const subTab = options.subTab || "residents";
      renderExploreContent(subTab);
    }
  }

  function showAdminFeatures() {
    document.getElementById("add-post-btn").classList.remove("hidden");
    document.getElementById("add-post-btn").classList.remove("bg-indigo-600");
    document.getElementById("add-post-btn").classList.add("bg-amber-500");
    document.getElementById("add-warning-option").classList.remove("hidden");
    document.getElementById("add-notice-option").classList.remove("hidden");
    document.getElementById("add-post-option").classList.add("hidden");
    document.getElementById("add-service-btn-explore").classList.add("hidden");
    document
      .getElementById("add-marketplace-btn-explore")
      .classList.add("hidden");
  }

  function showUserFeatures() {
    document.getElementById("add-post-btn").classList.remove("hidden");
    document.getElementById("add-post-btn").classList.remove("bg-amber-500");
    document.getElementById("add-post-btn").classList.add("bg-indigo-600");
    document.getElementById("add-warning-option").classList.add("hidden");
    document.getElementById("add-notice-option").classList.add("hidden");
    document.getElementById("add-post-option").classList.remove("hidden");
    document.getElementById("add-post-btn").style.display = "flex";
    document.getElementById("warnings-section").style.display = "block";
    document
      .getElementById("add-service-btn-explore")
      .classList.remove("hidden");
    document
      .getElementById("add-marketplace-btn-explore")
      .classList.remove("hidden");
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////POSTS///////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////

  const posts_q = query(postsRef, orderBy("createdAt", "desc"));

  onSnapshot(posts_q, (snapshot) => {
    const feed = document.getElementById("feed-container");
    feed.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const post = docSnap.data();
      const postId = docSnap.id;

      feed.innerHTML += `
        <div class="post bg-gray-800 p-4 rounded-lg mb-4" data-id="${postId}">
          <p class="text-gray-200 mb-2">${post.text}</p>
          ${
            post.imageUrl
              ? `<img src="${post.imageUrl}" class="rounded-md mb-2"/>`
              : ""
          }
          <div class="text-xs text-gray-400">
            ${
              post.createdAt
                ? post.createdAt.toDate().toLocaleString()
                : "Agora mesmo"
            }
          </div>
          <button class="like-btn text-indigo-400 mt-2" data-id="${postId}">
            ❤️ ${post.likes?.length || 0}
          </button>
        </div>
      `;
    });

    // Eventos de like
    document.querySelectorAll(".like-btn").forEach((btn) => {
      btn.addEventListener("click", () => darLike(btn.dataset.id));
    });
  });

  // Criar post
  document.getElementById("post-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("post-text").value;
    const file = document.getElementById("post-image-upload").files[0];

    let imageUrl = null;
    if (file) {
      const storageRef = ref(
        storage,
        `posts/${auth.currentUser.uid}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(postsRef, {
      authorId: auth.currentUser.uid,
      text,
      imageUrl,
      likes: [],
      createdAt: serverTimestamp(),
    });

    document.getElementById("post-text").value = "";
    document.getElementById("post-image-upload").value = "";
    document.getElementById("post-form").reset();
    goToTab("home");
  });

  async function darLike(postId) {
    const postRef = doc(db, "posts", postId);
    const userId = auth.currentUser.uid;

    const snapshot = await getDoc(postRef);
    const post = snapshot.data();

    if (post.likes?.includes(userId)) {
      await updateDoc(postRef, { likes: arrayRemove(userId) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(userId) });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////NOTICES/////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////

  const notices_q = query(noticesRef, orderBy("createdAt", "desc"));

  onSnapshot(notices_q, async (snapshot) => {
    isAdm = await getAdmStatus();
    const container = document.getElementById("notices-list");
    container.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const notice = docSnap.data();
      const noticeId = docSnap.id;
      container.innerHTML += `
        <div id="notice-${noticeId}" class="bg-gray-800 rounded-lg shadow-sm p-4 mb-4 border-l-4 border-indigo-500 flex justify-between items-start">
            <div>
                <span class="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">Comunicado Oficial</span>
                <h3 class="text-lg font-bold text-gray-200 mt-2">${
                  notice.title
                }</h3>
                <p class="text-sm text-gray-300">${notice.text}</p>
                <span class="text-xs text-gray-400">${
                  notice.createdAt?.toDate().toLocaleString() ||
                  "Data não disponível"
                }</span>
            </div>
            ${
              isAdm
                ? `
            <button class="delete-notice-btn text-gray-400 hover:text-red-500 ml-4" data-notice-id="${noticeId}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.234 21H7.766a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                </svg>
            </button>
            `
                : ""
            }
        </div>
        `;
    });
  });

  //Criar Aviso
  document
    .getElementById("notice-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("notice-title").value;
      const text = document.getElementById("notice-text").value;

      await addDoc(noticesRef, {
        title,
        text,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      alert("Novo aviso publicado com sucesso!");
      document.getElementById("notice-form").reset();
      goToTab("home");
    });

  //Deletar Aviso
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".delete-notice-btn")) {
      const noticeElement = e.target.closest('div[id^="notice-"]');
      const noticeId = noticeElement.id.replace("notice-", "");

      if (confirm("Tem certeza que deseja excluir este aviso?")) {
        try {
          await deleteDoc(doc(db, "notices", noticeId));
        } catch (error) {
          console.error("Erro ao deletar aviso:", error);
        }
      }
    }
  });

  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////Residents///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////

  function carregarMoradores() {
    const residentsList = document.getElementById("residents-list");

    // referência da coleção users, ordenando pelo nome
    const q = query(collection(db, "users"), orderBy("name"));

    // snapshot em tempo real
    onSnapshot(q, (snapshot) => {
      residentsList.innerHTML = ""; // limpa a lista antes de renderizar

      snapshot.forEach((doc) => {
        const user = doc.data();

        residentsList.innerHTML += `
        <div class="bg-gray-800 p-4 rounded-lg flex items-center space-x-3 cursor-pointer" data-uid="${
          doc.id
        }">
          <img src="${
            user.profileImage || "https://placehold.co/60x60"
          }" class="w-12 h-12 rounded-full object-cover"/>
          <div>
            <p class="text-gray-200 font-bold">${user.name}</p>
            <p class="text-gray-400 text-sm">Apto ${user.apartment || "-"}</p>
          </div>
        </div>
      `;
      });
    });
  }

  document
    .getElementById("residents-list")
    .addEventListener("click", async (e) => {
      const card = e.target.closest("[data-uid]");
      if (!card) return;

      const uid = card.dataset.uid;
      const snap = await getDoc(doc(db, "users", uid));

      if (snap.exists()) {
        const resident = snap.data();

        // Preencher informações do perfil
        document.getElementById("user-name").textContent = resident.name;
        document.getElementById(
          "user-apartment"
        ).textContent = `Apto ${resident.apartment}`;

        // Mostrar seção de informações
        document.getElementById("profile-info-section").style.display = "block";
        document.getElementById("profile-vehicles-section").style.display =
          "block";

        // Preencher informações de contato
        document.getElementById(
          "profile-phone"
        ).innerHTML = `<span class="font-semibold">Telefone:</span> ${
          resident.phone || "Não informado"
        }`;
        document.getElementById(
          "profile-email"
        ).innerHTML = `<span class="font-semibold">Email:</span> ${
          resident.email || "Não informado"
        }`;

        if (resident.emergencyContact) {
          document.getElementById(
            "profile-emergency"
          ).innerHTML = `<span class="font-semibold">Contato de Emergência:</span> ${resident.emergencyContact.name} - ${resident.emergencyContact.phone}`;
        }

        // Preencher veículos
        const vehiclesListEl = document.getElementById("vehicles-list");
        vehiclesListEl.innerHTML = "";
        if (resident.vehicles && resident.vehicles.length > 0) {
          resident.vehicles.forEach((vehicle) => {
            const li = document.createElement("li");
            li.className = "p-2 rounded-md bg-gray-700 text-sm";
            li.innerHTML = `<p><span class="font-semibold">${vehicle.make} ${vehicle.model}</span> (${vehicle.color})</p><p class="text-xs text-gray-400">Placa: ${vehicle.plate}</p>`;
            vehiclesListEl.appendChild(li);
          });
        }

        // Ir para a aba de perfil
        goToTab("profile", { userId: uid });
      }
    });

  function populateEditProfileForm() {
    const userDetails = residentsData.find(
      (res) => res.id === auth.currentUser.uid
    );
    if (!userDetails) return;
    document.getElementById("edit-phone").value = userDetails.phone || "";
    document.getElementById("edit-email").value = userDetails.email || "";
    if (userDetails.emergencyContact) {
      document.getElementById("edit-emergency-name").value =
        userDetails.emergencyContact.name || "";
      document.getElementById("edit-emergency-phone").value =
        userDetails.emergencyContact.phone || "";
    } else {
      document.getElementById("edit-emergency-name").value = "";
      document.getElementById("edit-emergency-phone").value = "";
    }
    const editVehiclesList = document.getElementById("edit-vehicles-list");
    editVehiclesList.innerHTML = "";
    if (userDetails.vehicles && userDetails.vehicles.length > 0) {
      userDetails.vehicles.forEach((vehicle, index) => {
        const vehicleDiv = document.createElement("div");
        vehicleDiv.className = "p-3 border border-gray-700 rounded-md relative";
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
        }" data-index="${index}" data-field="plate" class="vehicle-edit-input mt-1 w-full px-2 py-1 rounded-lg bg-gray-600 text-gray-200 text-sm"></div></div>`;
        editVehiclesList.appendChild(vehicleDiv);
      });
    }
    const addVehicleBtn = document.createElement("button");
    addVehicleBtn.type = "button";
    addVehicleBtn.id = "add-vehicle-btn";
    addVehicleBtn.className =
      "w-full mt-4 bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-indigo-400 transition-colors";
    addVehicleBtn.textContent = "+ Adicionar Novo Veículo";
    editVehiclesList.appendChild(addVehicleBtn);
  }

  function renderWarnings() {
    document.getElementById("warnings-list").innerHTML = "";
    if (userWarnings.length === 0) {
      document.getElementById("warnings-list").innerHTML =
        '<li class="text-sm text-gray-400">Nenhuma advertência registrada.</li>';
    } else {
      userWarnings.forEach((warning) => {
        const li = document.createElement("li");
        li.className = "p-2 rounded-md bg-gray-700 space-y-2";
        let imageHtml = "";
        if (warning.imageUrl) {
          imageHtml = `<img src="${warning.imageUrl}" alt="Evidência da advertência" class="w-full rounded-md mt-2">`;
        }
        li.innerHTML = `<div class="flex justify-between items-center"><span>${warning.reason}</span><span class="text-xs text-gray-400">${warning.date}</span></div>${imageHtml}`;
        document.getElementById("warnings-list").appendChild(li);
      });
    }
  }

  function showCorrectBtn() {
    if (document.getElementById("home").classList.contains("active")) {
      document.getElementById("add-post-btn").style.display = "flex";
      document.getElementById("floating-menu").style.display = "none";
    } else {
      document.getElementById("add-post-btn").style.display = "none";
    }
  }

  function renderChatList() {
    document.getElementById("chat-list-container").innerHTML = "";

    const chatListArray = Object.keys(currentChatHistory).map((chatId) => {
      return { id: chatId, ...currentChatHistory[chatId] };
    });

    chatListArray.sort((a, b) => {
      const lastMsgA = a.messages[a.messages.length - 1];
      const lastMsgB = b.messages[b.messages.length - 1];
      if (!lastMsgA) return 1;
      if (!lastMsgB) return -1;
      return lastMsgB.timestamp - lastMsgA.timestamp;
    });

    chatListArray.forEach((chat) => {
      const lastMessage =
        chat.messages[chat.messages.length - 1]?.text ||
        "Nenhuma mensagem ainda.";
      const chatElement = document.createElement("div");
      chatElement.className =
        "chat-item flex items-center p-3 rounded-lg bg-gray-800 shadow-sm hover:bg-gray-700 cursor-pointer";
      chatElement.dataset.chatId = chat.id;

      const contactDetails =
        residentsData.find((r) => r.id === chat.id) ||
        (chat.id === "admin"
          ? { colorHex: "#64748b" }
          : { colorHex: "#64748b" });

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
                `;
      document.getElementById("chat-list-container").appendChild(chatElement);
    });

    setupChatListListeners();
  }

  function setupChatListListeners() {
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.addEventListener("click", () => {
        const chatId = item.dataset.chatId;
        currentOpenChatId = chatId;
        const chatTitle = currentChatHistory[chatId].name;
        document.getElementById("messages").classList.remove("active");
        document.getElementById("chat-window").classList.add("active");
        document.getElementById("chat-name").textContent = chatTitle;
        renderMessages(chatId);
      });
    });
  }

  function renderMessages(chatId) {
    document.getElementById("chat-body").innerHTML = "";
    const messages = currentChatHistory[chatId].messages;
    messages.forEach((msg) => {
      const bubble = document.createElement("div");
      bubble.classList.add("message-bubble", msg.sender);
      bubble.textContent = msg.text;
      document.getElementById("chat-body").appendChild(bubble);
    });
    document.getElementById("chat-body").scrollTop =
      document.getElementById("chat-body").scrollHeight;
  }

  function sendMessage() {
    const text = document.getElementById("message-input").value.trim();
    if (text && currentOpenChatId) {
      const bubble = document.createElement("div");
      bubble.classList.add("message-bubble", "sent");
      bubble.textContent = text;
      document.getElementById("chat-body").appendChild(bubble);

      const newMessage = { sender: "sent", text: text, timestamp: new Date() };
      currentChatHistory[currentOpenChatId].messages.push(newMessage);

      renderChatList();

      document.getElementById("message-input").value = "";
      document.getElementById("chat-body").scrollTop =
        document.getElementById("chat-body").scrollHeight;
    }
  }

  function renderComments(postId) {
    const commentsList = document.querySelector(
      `.comments-section[data-post-id="${postId}"] .comments-list`
    );
    commentsList.innerHTML = "";
    if (comments[postId] && comments[postId].length > 0) {
      comments[postId].forEach((comment) => {
        const commentElement = document.createElement("div");
        commentElement.className = "p-2 rounded-md bg-gray-700";
        commentElement.innerHTML = `<p class="font-semibold text-gray-300">${comment.user}</p><p>${comment.text}</p>`;
        commentsList.appendChild(commentElement);
      });
    } else {
      commentsList.innerHTML =
        '<p class="text-xs text-gray-500">Nenhum comentário ainda.</p>';
    }
  }

  function addComment(postId, commentText) {
    if (commentText.trim() === "") return;
    const newComment = { user: currentUser.name, text: commentText };
    if (!comments[postId]) {
      comments[postId] = [];
    }
    comments[postId].push(newComment);
    const postElement = document.querySelector(
      `.post[data-post-id="${postId}"]`
    );
    const commentCountSpan = postElement.querySelector(".comment-count");
    commentCountSpan.textContent = comments[postId].length;
    renderComments(postId);
  }

  function renderExploreContent(tab) {
    document
      .querySelectorAll(".explore-content")
      .forEach((content) => content.classList.remove("active"));
    document
      .querySelectorAll(".explore-nav-btn")
      .forEach((btn) => btn.classList.remove("bg-indigo-600", "text-white"));
    document
      .querySelectorAll(".explore-nav-btn")
      .forEach((btn) => btn.classList.add("bg-gray-700", "text-gray-300"));
    let targetContent;
    if (tab === "residents") {
      targetContent = document.getElementById("residents-content");
      carregarMoradores();
    } else if (tab === "services") {
      targetContent = document.getElementById("services-content");
      renderServices();
    } else {
      targetContent = document.getElementById("marketplace-content");
      renderMarketplace();
    }
    targetContent.classList.add("active");
    document
      .getElementById(`${tab}-tab-explore`)
      .classList.add("bg-indigo-600", "text-white");
    document
      .getElementById(`${tab}-tab-explore`)
      .classList.remove("bg-gray-700", "text-gray-300");
  }

  function renderServices() {
    document.getElementById("services-list").innerHTML = "";
    servicesData.forEach((service) => {
      const serviceElement = document.createElement("div");
      serviceElement.id = `service-${service.id}`;
      serviceElement.className =
        "service-item bg-gray-800 rounded-lg shadow-sm p-4 flex justify-between items-start";
      const deleteBtnHtml =
        isAdm || auth.currentUser.uid === service.ownerId
          ? `<button class="delete-item-btn text-gray-400 hover:text-red-500 ml-4" data-item-id="${service.id}" data-item-type="service"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.234 21H7.766a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>`
          : "";
      serviceElement.innerHTML = `<div><p class="font-bold text-gray-200">${service.title}</p><p class="text-sm text-gray-400 mt-1">Fornecedor: ${service.provider}</p><p class="text-sm text-gray-300 mt-2">${service.description}</p></div>${deleteBtnHtml}`;
      document.getElementById("services-list").appendChild(serviceElement);
    });
    setupDynamicEventListeners();
  }

  function renderMarketplace() {
    document.getElementById("marketplace-list").innerHTML = "";
    marketplaceData.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.id = `marketplace-${item.id}`;
      itemElement.className =
        "marketplace-item bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col relative";
      const deleteBtnHtml =
        isAdm || auth.currentUser.uid === item.ownerId
          ? `<button class="delete-item-btn text-white hover:text-red-400 absolute top-2 right-2 bg-gray-900 bg-opacity-50 rounded-full p-1" data-item-id="${item.id}" data-item-type="marketplace"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.234 21H7.766a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>`
          : "";
      itemElement.innerHTML = `<img src="${item.imageUrl}" alt="${item.title}" class="w-full h-32 object-cover"><div class="p-3 flex-grow"><p class="font-bold text-gray-200">${item.title}</p><p class="text-sm text-indigo-400 mt-1">${item.price}</p><p class="text-xs text-gray-400 mt-2">${item.description}</p></div>${deleteBtnHtml}`;
      document.getElementById("marketplace-list").appendChild(itemElement);
    });
    setupDynamicEventListeners();
  }

  function setupDynamicEventListeners() {
    document
      .querySelectorAll(".like-btn")
      .forEach((btn) => btn.removeEventListener("click", darLike));
    document
      .querySelectorAll(".comment-btn")
      .forEach((btn) => btn.removeEventListener("click", handleCommentClick));
    document
      .querySelectorAll(".send-comment-btn")
      .forEach((btn) => btn.removeEventListener("click", handleSendComment));
    document
      .querySelectorAll(".comment-input")
      .forEach((input) =>
        input.removeEventListener("keypress", handleSendCommentOnEnter)
      );
    document
      .querySelectorAll(".delete-item-btn")
      .forEach((btn) => btn.removeEventListener("click", handleDeleteItem));
    document
      .querySelectorAll(".delete-post-btn")
      .forEach((btn) => btn.removeEventListener("click", handleDeletePost));
    document
      .querySelectorAll(".like-btn")
      .forEach((btn) => btn.addEventListener("click", darLike));
    document
      .querySelectorAll(".comment-btn")
      .forEach((btn) => btn.addEventListener("click", handleCommentClick));
    document
      .querySelectorAll(".send-comment-btn")
      .forEach((btn) => btn.addEventListener("click", handleSendComment));
    document
      .querySelectorAll(".comment-input")
      .forEach((input) =>
        input.addEventListener("keypress", handleSendCommentOnEnter)
      );
    document
      .querySelectorAll(".delete-item-btn")
      .forEach((btn) => btn.addEventListener("click", handleDeleteItem));
    document
      .querySelectorAll(".delete-post-btn")
      .forEach((btn) => btn.addEventListener("click", handleDeletePost));
  }

  function handleCommentClick(event) {
    const btn = event.currentTarget;
    const postId = btn.closest(".post").dataset.postId;
    const commentsSection = document.querySelector(
      `.comments-section[data-post-id="${postId}"]`
    );
    if (commentsSection.style.display === "block") {
      commentsSection.style.display = "none";
    } else {
      commentsSection.style.display = "block";
      renderComments(postId);
    }
  }

  function handleSendComment(event) {
    const postElement = event.currentTarget.closest(".post");
    const postId = postElement.dataset.postId;
    const commentInput = postElement.querySelector(".comment-input");
    const commentText = commentInput.value;
    if (commentText.trim() !== "") {
      addComment(postId, commentText);
      commentInput.value = "";
    }
  }

  function handleSendCommentOnEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendComment(e);
    }
  }

  function handleDeleteItem(event) {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    const btn = event.currentTarget;
    const itemId = btn.dataset.itemId;
    const itemType = btn.dataset.itemType;
    if (itemType === "service") {
      servicesData = servicesData.filter((item) => item.id !== itemId);
      renderServices();
    } else if (itemType === "marketplace") {
      marketplaceData = marketplaceData.filter((item) => item.id !== itemId);
      renderMarketplace();
    }
  }
  function handleDeletePost(event) {
    const postElement = event.currentTarget.closest(".post");
    const postId = postElement.dataset.postId;
    if (confirm("Tem certeza de que deseja excluir esta publicação?")) {
      postElement.remove();
      delete posts[postId];
      delete comments[postId];
    }
  }
  function addDeleteButtonsToExistingPosts() {
    document.querySelectorAll(".post").forEach((postElement) => {
      const ownerId = postElement.dataset.ownerId;
      if (auth.currentUser.uid === ownerId || isAdm) {
        const headerDiv = postElement.querySelector(".post-header");
        if (headerDiv && !headerDiv.querySelector(".delete-post-btn")) {
          const deleteBtn = document.createElement("button");
          deleteBtn.className =
            "delete-post-btn text-gray-400 hover:text-red-500 ml-2";
          deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.234 21H7.766a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;
          headerDiv.appendChild(deleteBtn);
        }
      }
    });
    setupDynamicEventListeners();
  }

  function renderReservationsList() {
    document.getElementById("reservations-list").innerHTML = "";
    for (const areaId in reservationsData) {
      const area = reservationsData[areaId];
      const li = document.createElement("li");
      li.className = "p-2 rounded-md bg-gray-700";

      const sortedBookings = [...area.bookings].sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      const reservedDatesHtml = sortedBookings
        .map((booking) => {
          const [year, month, day] = booking.date.split("-");
          return `${day}/${month}`;
        })
        .join(", ");

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
                `;
      document.getElementById("reservations-list").appendChild(li);
    }
  }

  function renderCalendar() {
    document.getElementById("calendar-days").innerHTML = "";
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    document.getElementById(
      "month-year"
    ).textContent = `${currentCalendarDate.toLocaleString("pt-BR", {
      month: "long",
    })} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const bookings = reservationsData[currentReservationAreaId].bookings;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDayOfMonth; i++) {
      document.getElementById(
        "calendar-days"
      ).innerHTML += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement("div");
      dayEl.textContent = day;
      dayEl.classList.add("calendar-day");
      const dateForDay = new Date(year, month, day);
      dayEl.dataset.date = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      if (
        day === startOfToday.getDate() &&
        month === startOfToday.getMonth() &&
        year === startOfToday.getFullYear()
      ) {
        dayEl.classList.add("today");
      }

      if (dateForDay < startOfToday) {
        dayEl.classList.add("past");
      } else {
        const bookingForDay = bookings.find(
          (b) => b.date === dayEl.dataset.date
        );
        if (bookingForDay) {
          if (bookingForDay.userId === auth.currentUser.uid) {
            dayEl.classList.add("cancellable");
          } else {
            dayEl.classList.add("reserved");
          }
        } else {
          dayEl.classList.add("available");
        }
      }
      document.getElementById("calendar-days").appendChild(dayEl);
    }
  }

  function openReservationModal(areaId) {
    currentReservationAreaId = areaId;
    document.getElementById(
      "reservation-area-name"
    ).textContent = `Reservar: ${reservationsData[areaId].name}`;
    currentCalendarDate = new Date();
    renderCalendar();
    document.getElementById("reservation-modal").style.display = "flex";
  }

  document
    .getElementById("reservations-list")
    .addEventListener("click", (e) => {
      if (e.target.classList.contains("reserve-btn")) {
        const areaId = e.target.dataset.areaId;
        openReservationModal(areaId);
      }
    });

  document
    .getElementById("close-reservation-modal")
    .addEventListener("click", () => {
      document.getElementById("reservation-modal").style.display = "none";
    });

  document.getElementById("prev-month-btn").addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("next-month-btn").addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
  });

  document.getElementById("calendar-days").addEventListener("click", (e) => {
    const clickedDay = e.target;
    const date = clickedDay.dataset.date;
    if (!date) return;

    const [year, month, day] = date.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    if (clickedDay.classList.contains("available")) {
      if (
        confirm(
          `Confirmar reserva para ${reservationsData[currentReservationAreaId].name} no dia ${formattedDate}?`
        )
      ) {
        reservationsData[currentReservationAreaId].bookings.push({
          date: date,
          userId: auth.currentUser.uid,
        });
        alert("Reserva confirmada com sucesso!");
        renderReservationsList();
        renderCalendar();
      }
    } else if (clickedDay.classList.contains("cancellable")) {
      if (
        confirm(
          `Deseja cancelar sua reserva para ${reservationsData[currentReservationAreaId].name} no dia ${formattedDate}?`
        )
      ) {
        const bookings = reservationsData[currentReservationAreaId].bookings;
        const indexToRemove = bookings.findIndex(
          (b) => b.date === date && b.userId === auth.currentUser.uid
        );
        if (indexToRemove > -1) {
          bookings.splice(indexToRemove, 1);
          alert("Reserva cancelada com sucesso!");
          renderReservationsList();
          renderCalendar();
        }
      }
    }
  });

  document.getElementById("add-post-btn").addEventListener("click", () => {
    if (document.getElementById("add-post-btn").style.display !== "none") {
      document.getElementById("floating-menu").style.display =
        document.getElementById("floating-menu").style.display === "flex"
          ? "none"
          : "flex";
    }
  });
  document.querySelectorAll(".btn-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.id.replace("-tab", "");
      goToTab(targetId);
    });
  });
  document.querySelectorAll(".explore-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.id.replace("-tab-explore", "");
      goToTab("explore", { subTab: tabName });
    });
  });
  document
    .getElementById("add-service-btn-explore")
    .addEventListener("click", () => {
      document.getElementById("floating-menu").style.display = "none";
      document.getElementById("main-content").classList.add("hidden");
      document.getElementById("main-nav").classList.add("hidden");
      document.getElementById("main-header").classList.add("hidden");
      document.getElementById("add-service-screen").style.display = "flex";
    });
  document
    .getElementById("add-marketplace-btn-explore")
    .addEventListener("click", () => {
      document.getElementById("floating-menu").style.display = "none";
      document.getElementById("main-content").classList.add("hidden");
      document.getElementById("main-nav").classList.add("hidden");
      document.getElementById("main-header").classList.add("hidden");
      document.getElementById("add-marketplace-screen").style.display = "flex";
    });
  document.getElementById("back-to-messages").addEventListener("click", () => {
    document.getElementById("chat-window").classList.remove("active");
    document.getElementById("messages").classList.add("active");
  });
  document.getElementById("send-btn").addEventListener("click", sendMessage);
  document.getElementById("message-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
  document.getElementById("add-post-option").addEventListener("click", () => {
    document.getElementById("floating-menu").style.display = "none";
    document.getElementById("main-content").classList.add("hidden");
    document.getElementById("main-nav").classList.add("hidden");
    document.getElementById("main-header").classList.add("hidden");
    document.getElementById("add-post-screen").style.display = "flex";
  });
  document.getElementById("add-notice-option").addEventListener("click", () => {
    document.getElementById("floating-menu").style.display = "none";
    document.getElementById("main-content").classList.add("hidden");
    document.getElementById("main-nav").classList.add("hidden");
    document.getElementById("main-header").classList.add("hidden");
    document.getElementById("add-notice-screen").style.display = "flex";
  });
  document
    .getElementById("add-warning-option")
    .addEventListener("click", () => {
      document.getElementById("floating-menu").style.display = "none";
      document.getElementById("main-content").classList.add("hidden");
      document.getElementById("main-nav").classList.add("hidden");
      document.getElementById("main-header").classList.add("hidden");
      document.getElementById("add-warning-screen").style.display = "flex";
    });
  document.getElementById("cancel-notice-btn").addEventListener("click", () => {
    goToTab("home");
  });
  document
    .getElementById("cancel-service-btn")
    .addEventListener("click", () => {
      goToTab("explore", { subTab: "services" });
    });
  document
    .getElementById("cancel-marketplace-btn")
    .addEventListener("click", () => {
      goToTab("explore", { subTab: "marketplace" });
    });

  document
    .getElementById("add-service-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const serviceTitle = document.getElementById("service-title").value;
      const serviceDescription = document.getElementById(
        "service-description"
      ).value;
      if (serviceTitle.trim() === "" || serviceDescription.trim() === "") {
        alert("Por favor, preencha todos os campos do serviço.");
        return;
      }
      const newService = {
        id: `serv-${Date.now()}`,
        ownerId: auth.currentUser.uid,
        title: serviceTitle,
        provider: `${currentUser.name} (${currentUser.apartment})`,
        description: serviceDescription,
      };
      servicesData.push(newService);
      alert("Novo serviço adicionado com sucesso!");
      document.getElementById("add-service-form").reset();
      goToTab("explore", { subTab: "services" });
    });
  document
    .getElementById("add-marketplace-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const marketplaceTitle =
        document.getElementById("marketplace-title").value;
      const marketplaceDescription = document.getElementById(
        "marketplace-description"
      ).value;
      const marketplacePrice =
        document.getElementById("marketplace-price").value;
      const marketplaceImageInput = document.getElementById(
        "marketplace-image-upload"
      );
      let marketplaceImageUrl = "";
      if (marketplaceImageInput.files && marketplaceImageInput.files[0]) {
        const file = marketplaceImageInput.files[0];
        marketplaceImageUrl = URL.createObjectURL(file);
      }
      if (
        marketplaceTitle.trim() === "" ||
        marketplaceDescription.trim() === "" ||
        marketplacePrice.trim() === "" ||
        marketplaceImageUrl === ""
      ) {
        alert("Por favor, preencha todos os campos, incluindo a imagem.");
        return;
      }
      const newItem = {
        id: `mp-${Date.now()}`,
        ownerId: auth.currentUser.uid,
        title: marketplaceTitle,
        description: marketplaceDescription,
        price: "R$ " + marketplacePrice,
        imageUrl: marketplaceImageUrl,
      };
      marketplaceData.push(newItem);
      alert("Novo item adicionado ao marketplace com sucesso!");
      document.getElementById("add-marketplace-form").reset();
      goToTab("explore", { subTab: "marketplace" });
    });
  document
    .getElementById("cancel-warning-btn")
    .addEventListener("click", () => {
      goToTab("home");
    });
  document.getElementById("warning-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedTenant = document.getElementById("tenant-select").value;
    const warningReason = document.getElementById("warning-reason").value;
    const warningImageInput = document.getElementById("warning-image-upload");
    let warningImageUrl = "";
    if (warningImageInput.files && warningImageInput.files[0]) {
      const file = warningImageInput.files[0];
      warningImageUrl = URL.createObjectURL(file);
    }
    if (warningReason.trim() === "") {
      alert("Por favor, insira o motivo da advertência.");
      return;
    }
    alert(`Advertência criada para ${selectedTenant}: "${warningReason}"`);
    userWarnings.push({
      id: userWarnings.length + 1,
      reason: warningReason,
      date: new Date().toLocaleDateString("pt-BR"),
      imageUrl: warningImageUrl || null,
    });
    document.getElementById("warning-form").reset();
    goToTab("home");
  });
  document.getElementById("cancel-post-btn").addEventListener("click", () => {
    goToTab("home");
  });

  document.getElementById("edit-profile-btn").addEventListener("click", () => {
    populateEditProfileForm();
    document.getElementById("main-content").classList.add("hidden");
    document.getElementById("main-nav").classList.add("hidden");
    document.getElementById("main-header").classList.add("hidden");
    document.getElementById("edit-profile-screen").style.display = "block";
  });
  document
    .getElementById("cancel-edit-profile-btn")
    .addEventListener("click", () => {
      document.getElementById("edit-profile-screen").style.display = "none";
      document.getElementById("main-content").classList.remove("hidden");
      document.getElementById("main-nav").classList.remove("hidden");
      document.getElementById("main-header").classList.remove("hidden");
      goToTab("profile");
    });
  document
    .getElementById("edit-profile-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const userIndex = residentsData.findIndex(
        (res) => res.id === auth.currentUser.uid
      );
      if (userIndex === -1) return;
      residentsData[userIndex].phone =
        document.getElementById("edit-phone").value;
      residentsData[userIndex].email =
        document.getElementById("edit-email").value;
      residentsData[userIndex].emergencyContact = {
        name: document.getElementById("edit-emergency-name").value,
        phone: document.getElementById("edit-emergency-phone").value,
      };
      const vehicleInputs = document.querySelectorAll(".vehicle-edit-input");
      const updatedVehicles = [];
      const numVehicles = vehicleInputs.length / 4;
      for (let i = 0; i < numVehicles; i++) {
        updatedVehicles.push({
          make: document.querySelector(`[data-index="${i}"][data-field="make"]`)
            .value,
          model: document.querySelector(
            `[data-index="${i}"][data-field="model"]`
          ).value,
          color: document.querySelector(
            `[data-index="${i}"][data-field="color"]`
          ).value,
          plate: document.querySelector(
            `[data-index="${i}"][data-field="plate"]`
          ).value,
        });
      }
      residentsData[userIndex].vehicles = updatedVehicles;
      currentUser = { ...residentsData[userIndex] };
      alert("Perfil atualizado com sucesso!");
      document.getElementById("edit-profile-screen").style.display = "none";
      document.getElementById("main-content").classList.remove("hidden");
      document.getElementById("main-nav").classList.remove("hidden");
      document.getElementById("main-header").classList.remove("hidden");
      goToTab("profile");
    });
  document
    .getElementById("edit-vehicles-list")
    .addEventListener("click", (e) => {
      const deleteButton = e.target.closest(".delete-vehicle-btn");
      const addButton = e.target.closest("#add-vehicle-btn");
      if (deleteButton) {
        const indexToDelete = parseInt(deleteButton.dataset.index, 10);
        if (
          confirm(
            `Tem certeza que deseja excluir o Veículo ${indexToDelete + 1}?`
          )
        ) {
          const userIndex = residentsData.findIndex(
            (res) => res.id === auth.currentUser.uid
          );
          if (userIndex > -1) {
            residentsData[userIndex].vehicles.splice(indexToDelete, 1);
            populateEditProfileForm();
          }
        }
      }
      if (addButton) {
        const userIndex = residentsData.findIndex(
          (res) => res.id === auth.currentUser.uid
        );
        if (userIndex > -1) {
          if (!residentsData[userIndex].vehicles) {
            residentsData[userIndex].vehicles = [];
          }
          residentsData[userIndex].vehicles.push({
            make: "",
            model: "",
            color: "",
            plate: "",
          });
          populateEditProfileForm();
        }
      }
    });
  document.querySelectorAll(".post").forEach((post) => {
    const postId = post.dataset.postId;
    if (comments[postId]) {
      const commentCountSpan = post.querySelector(".comment-count");
      commentCountSpan.textContent = comments[postId].length;
    }
  });
  setupDynamicEventListeners();
  showCorrectBtn();
  document.getElementById("residents-list").addEventListener("click", (e) => {
    const card = e.target.closest(".resident-card");
    if (card) {
      const residentId = card.dataset.residentId;
      goToTab("profile", { userId: residentId });
    }
  });
  document
    .getElementById("back-to-explore-btn")
    .addEventListener("click", () => {
      goToTab("explore", { subTab: "residents" });
    });
  document.getElementById("feed-container").addEventListener("click", (e) => {
    const header = e.target.closest(".post-header");
    if (header) {
      const post = header.closest(".post");
      const ownerId = post.dataset.ownerId;
      if (ownerId) {
        goToTab("profile", { userId: ownerId });
      }
    }
  });

  document
    .getElementById("send-message-from-profile-btn")
    .addEventListener("click", (e) => {
      const targetUserId = e.currentTarget.dataset.userId;
      if (!targetUserId) return;

      if (!currentChatHistory[targetUserId]) {
        const targetUserDetails = residentsData.find(
          (res) => res.id === targetUserId
        );

        if (targetUserDetails) {
          currentChatHistory[targetUserId] = {
            name: `${targetUserDetails.name} (${targetUserDetails.apartment})`,
            initials: targetUserDetails.initials,
            borderColor: targetUserDetails.borderColor,
            messages: [],
          };
        } else if (targetUserId === "admin-user") {
          currentChatHistory[targetUserId] = {
            name: `Administração`,
            initials: "A",
            borderColor: "border-slate-500",
            messages: [],
          };
        }
      }

      goToTab("messages");

      if (
        !document.querySelector(`.chat-item[data-chat-id="${targetUserId}"]`)
      ) {
        renderChatList();
      }

      const chatListItem = document.querySelector(
        `.chat-item[data-chat-id="${targetUserId}"]`
      );
      if (chatListItem) {
        chatListItem.click();
      }
    });
});
