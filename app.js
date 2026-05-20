let pets = JSON.parse(localStorage.getItem('cp_pets')) || [];
let tutor = JSON.parse(localStorage.getItem('cp_tutor_single')) || null;
let currentTutorImageBase64 = "";
let currentPetImageBase64 = "";

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
}

function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    const sideBtn = document.getElementById('btn-' + id);
    if(sideBtn) sideBtn.classList.add('active');
    
    updateUI();
}

function triggerFileInput(id) {
    document.getElementById(id).click();
}

function handleDragOver(e) {
    e.preventDefault();
}

function processImageFile(files, callback) {
    if (files && files.type && files.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            callback(event.target.result);
        };
        reader.readAsDataURL(files);
    }
}

function handleTutorDrop(e) {
    e.preventDefault();
    if(e.dataTransfer.files.length > 0) {
        processImageFile(e.dataTransfer.files[0], function(base64) {
            currentTutorImageBase64 = base64;
            document.getElementById('tDropZone').innerText = "Imagem carregada com sucesso!";
        });
    }
}

function handleTutorFileSelect(e) {
    if(e.target.files.length > 0) {
        processImageFile(e.target.files[0], function(base64) {
            currentTutorImageBase64 = base64;
            document.getElementById('tDropZone').innerText = "Imagem carregada com sucesso!";
        });
    }
}

function handlePetDrop(e) {
    e.preventDefault();
    if(e.dataTransfer.files.length > 0) {
        processImageFile(e.dataTransfer.files[0], function(base64) {
            currentPetImageBase64 = base64;
            document.getElementById('pDropZone').innerText = "Imagem carregada com sucesso!";
        });
    }
}

function handlePetFileSelect(e) {
    if(e.target.files.length > 0) {
        processImageFile(e.target.files[0], function(base64) {
            currentPetImageBase64 = base64;
            document.getElementById('pDropZone').innerText = "Imagem carregada com sucesso!";
        });
    }
}

function updateUI() {
    const tutorEditContainer = document.getElementById('tutor-edit-action-container');
    const backupDisplayCard = document.getElementById('backup-contact-display');
    
    if(tutor) {
        document.getElementById('hero-name').innerText = tutor.name;
        document.getElementById('hero-address').innerText = tutor.address || 'Endereço não cadastrado';
        document.getElementById('hero-img').src = tutor.pic || 'https://placeholder.com';
        
        if (tutor.backupName) {
            backupDisplayCard.style.display = "block";
            document.getElementById('hero-backup-name').innerText = `Nome: ${tutor.backupName}`;
            document.getElementById('hero-backup-phone').innerText = `Tel: ${tutor.backupPhone || 'N/A'}`;
            document.getElementById('hero-backup-address').innerText = `End: ${tutor.backupAddr || 'N/A'}`;
        } else {
            backupDisplayCard.style.display = "none";
        }
        
        tutorEditContainer.innerHTML = `
            <button class="btn-main btn-edit" style="padding:6px; font-size:0.8rem; margin-top:10px;" onclick="editTutor()">Editar Perfil</button>
            <button class="btn-main" style="background:#e57373; padding:6px; font-size:0.8rem; margin-top:4px;" onclick="deleteTutor()">Limpar Dados</button>
        `;
    } else {
        document.getElementById('hero-name').innerText = "Nenhum Tutor Cadastrado";
        document.getElementById('hero-address').innerText = "";
        document.getElementById('hero-img').src = "https://placeholder.com";
        backupDisplayCard.style.display = "none";
        tutorEditContainer.innerHTML = `
            <button class="btn-main btn-edit" style="padding:6px; font-size:0.8rem; margin-top:10px;" onclick="showView('reg-tutor')">Cadastrar Tutor</button>
        `;
    }

    // Renders all pets independently of tutor status connection
    const relativePetsMarkup = pets.map((p, originalIdx) => {
        return `
            <div class="pet-photo-card" onclick="editPet(${originalIdx})">
                <img src="${p.pic || 'https://placeholder.com'}" alt="${p.name}">
                <div class="pet-name-overlay">${p.name}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('hero-pets').innerHTML = relativePetsMarkup || '<p style="color:#442D1C; font-size:0.9rem;">Nenhum animal de estimação vinculado ainda.</p>';
}

function saveTutor() {
    tutor = {
        name: document.getElementById('tName').value,
        phone: document.getElementById('tPhone').value,
        email: document.getElementById('tEmail').value,
        address: document.getElementById('tAddr').value,
        backupName: document.getElementById('tBackupName').value,
        backupPhone: document.getElementById('tBackupPhone').value,
        backupAddr: document.getElementById('tBackupAddr').value,
        pic: currentTutorImageBase64 || (tutor ? tutor.pic : "")
    };
    if (!tutor.name) return alert("Por favor, digite pelo menos o nome do tutor.");

    localStorage.setItem('cp_tutor_single', JSON.stringify(tutor));
    
    document.getElementById('tutor-form-title').innerText = "Registrar Tutor";
    document.querySelectorAll('#reg-tutor input').forEach(input => input.value = "");
    document.getElementById('tDropZone').innerText = "Arrastar imagem do seu explorador de arquivos ou clicar aqui";
    currentTutorImageBase64 = "";
    showView('profile');
}

function editTutor() {
    if(!tutor) return;
    document.getElementById('tName').value = tutor.name;
    document.getElementById('tPhone').value = tutor.phone;
    document.getElementById('tEmail').value = tutor.email;
    document.getElementById('tAddr').value = tutor.address;
    document.getElementById('tBackupName').value = tutor.backupName || "";
    document.getElementById('tBackupPhone').value = tutor.backupPhone || "";
    document.getElementById('tBackupAddr').value = tutor.backupAddr || "";
    currentTutorImageBase64 = tutor.pic;
    if(tutor.pic) document.getElementById('tDropZone').innerText = "Imagem existente carregada.";
    document.getElementById('tutor-form-title').innerText = "Editar Cadastro do Tutor";
    showView('reg-tutor');
}

function deleteTutor() {
    if (!confirm("Deseja apagar permanentemente os dados do tutor? Os pets continuarão salvos.")) return;
    tutor = null;
    localStorage.removeItem('cp_tutor_single');
    updateUI();
}

function savePet() {
    const idx = document.getElementById('edit-pet-idx').value;
    const pet = {
        name: document.getElementById('pName').value,
        species: document.getElementById('pSpecies').value,
        color: document.getElementById('pColor').value,
        gender: document.getElementById('pGender').value,
        fur: document.getElementById('pFur').value,
        age: document.getElementById('pAge').value,
        birth: document.getElementById('pBirth').value,
        pic: currentPetImageBase64 || (idx !== "-1" ? pets[idx].pic : "")
    };
    pet.vac = document.getElementById('pVac').value;
    pet.alg = document.getElementById('pAlg').value;
    pet.sur = document.getElementById('pSur').value;

    if (!pet.name) return alert("Por favor, digite pelo menos o nome do pet.");

    if (idx == -1) pets.push(pet);
    else pets[idx] = pet;

    localStorage.setItem('cp_pets', JSON.stringify(pets));
    resetPetForm();
    showView('profile');
}

function editPet(i) {
    const p = pets[i];
    document.getElementById('edit-pet-idx').value = i;
    document.getElementById('pName').value = p.name;
    document.getElementById('pSpecies').value = p.species || '';
    document.getElementById('pColor').value = p.color;
    document.getElementById('pGender').value = p.gender;
    document.getElementById('pFur').value = p.fur;
    document.getElementById('pAge').value = p.age;
    document.getElementById('pBirth').value = p.birth;
    document.getElementById('pVac').value = p.vac;
    document.getElementById('pAlg').value = p.alg;
    document.getElementById('pSur').value = p.sur;
    currentPetImageBase64 = p.pic;
    if(p.pic) document.getElementById('pDropZone').innerText = "Imagem existente carregada.";
    document.getElementById('pet-form-title').innerText = "Editar Cadastro do Pet";
    
    document.getElementById('pet-delete-action-container').innerHTML = `
        <button class="btn-main" style="background:#e57373; margin-top:15px;" onclick="deletePet(${i})">Excluir Registro de Pet</button>
        <button class="btn-main" style="background:#81c784; margin-top:10px;" onclick="downloadPet(${i})">Baixar Perfil TXT</button>
    `;
    showView('reg-pet');
}

function resetPetForm() {
    document.getElementById('edit-pet-idx').value = "-1";
    document.getElementById('pet-form-title').innerText = "Registrar Novo Pet";
    document.querySelectorAll('#reg-pet input, #reg-pet textarea').forEach(el => el.value = "");
    document.getElementById('pDropZone').innerText = "Arrastar imagem do seu explorador de arquivos ou clicar aqui";
    document.getElementById('pet-delete-action-container').innerHTML = "";
    currentPetImageBase64 = "";
}

function deletePet(i) {
    if (!confirm("Tem certeza de que deseja excluir este pet?")) return;
    pets.splice(i, 1);
    localStorage.setItem('cp_pets', JSON.stringify(pets));
    resetPetForm();
    showView('profile');
}

function downloadPet(idx) {
    const p = pets[idx];
    const text = `========================================\n` +
                `        CARTEIRINHA PET REGISTRY        \n` +
                `========================================\n\n` +
                `NOME DO PET  : ${p.name}\n` +
                `ESPÉCIE      : ${p.species || 'Não Informado'}\n` +
                `GÊNERO       : ${p.gender}\n` +
                `IDADE        : ${p.age || 0} anos\n` +
                `NASCIMENTO   : ${p.birth || 'Não Informado'}\n` +
                `PELAGEM      : Pelo ${p.fur || 'N/A'} | Cor ${p.color || 'N/A'}\n\n` +
                `----------------------------------------\n` +
                `           HISTÓRICO DE SAÚDE           \n` +
                `----------------------------------------\n` +
                `VACINAS:\n${p.vac || 'Nenhuma recordada.'}\n\n` +
                `ALERGIAS:\n${p.alg || 'Nenhuma recordada.'}\n\n` +
                `Hospitalar/Cirúrgico:\n${p.sur || 'Nenhum registro crítico.'}\n\n` +
                `========================================`;
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const anchor = document.createElement('a');
    anchor.download = `${p.name.replace(/\s+/g, '_')}_Carteirinha.txt`;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
}

updateUI();
