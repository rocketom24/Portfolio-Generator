// Global variables
let imagePreview = '';
let showPortfolio = false;
let hideTimer;
let selectedPortfolioId = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Set up image upload handler
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  const fileInput = document.getElementById('fileInput');

  imagePreviewContainer.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', displayImage);

  // Set up modal close on overlay click
  const portfolioModal = document.getElementById('portfolioModal');
  portfolioModal.addEventListener('click', (e) => {
    if (e.target === portfolioModal) {
      setShowPortfolio(false);
    }
  });
});

// Image handling
function displayImage(event) {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview = e.target?.result;
      updateImagePreview();
    };
    reader.readAsDataURL(file);
  }
}

function updateImagePreview() {
  const container = document.getElementById('imagePreviewContainer');
  if (imagePreview) {
    container.innerHTML = `<img src="${imagePreview}" alt="Profile" class="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-lg cursor-pointer hover:scale-105 transition-transform hover:border-pink-400/50">`;
  } else {
    container.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12 15"></line>
      </svg>`;
  }
}

// Portfolio actions
function generatePortfolio() {
  const fullName = document.getElementById('fullName').value;
  const contactInfo = document.getElementById('contactInfo').value;
  const bio = document.getElementById('bio').value;
  const skills = document.getElementById('skills').value;
  const education = document.getElementById('education').value;
  const experience = document.getElementById('experience').value;
  const projects = document.getElementById('projects').value;

  if (!fullName || !contactInfo || !bio || !skills || !education || !experience || !projects) {
    showMessageModal('Warning', 'Please fill out all fields.');
    return;
  }

  // Assuming validation is successful
  showMessageModal('Success', 'Portfolio generated successfully.');
}

function showMessageModal(title, content) {
  document.getElementById('messageModalTitle').textContent = title;
  document.getElementById('messageModalContent').textContent = content;
  const modal = document.getElementById('messageModal');
  const contentDiv = modal.querySelector('.modal-content');
  modal.classList.remove('hidden');
  setTimeout(() => contentDiv.classList.add('show'), 10);
}

function closeMessageModal() {
  const modal = document.getElementById('messageModal');
  const contentDiv = modal.querySelector('.modal-content');
  contentDiv.classList.remove('show');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

async function savePortfolio() {
  const portfolioData = {
    fullName: document.getElementById('fullName').value,
    contactInfo: document.getElementById('contactInfo').value,
    bio: document.getElementById('bio').value,
    skills: document.getElementById('skills').value,
    education: document.getElementById('education').value,
    experience: document.getElementById('experience').value,
    projects: document.getElementById('projects').value,
    imagePreview: imagePreview
  };

  try {
    const response = await fetch('http://localhost:5000/api/portfolios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(portfolioData)
    });

    if (response.ok) {
      const savedPortfolio = await response.json();
      console.log('Portfolio saved successfully:', savedPortfolio);
    } else {
      console.error('Failed to save portfolio');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayPortfolios(portfolios) {
  const container = document.getElementById('savedPortfoliosList');
  container.innerHTML = portfolios.map(portfolio => `
    <li class="p-4 bg-white/10 rounded-lg cursor-pointer border-b border-gray-300 hover:bg-white/20 transition-colors flex items-center gap-4" onclick="selectPortfolio('${portfolio._id}')">
      <div class="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
        ${portfolio.imagePreview ? `<img src="${portfolio.imagePreview}" alt="Profile" class="w-full h-full object-cover">` : ''}
      </div>
      <div>
        <h3 class="text-white font-medium">${portfolio.fullName}</h3>
        <p class="text-white text-sm">${portfolio.contactInfo}</p>
      </div>
    </li>
  `).join('');
}

function selectPortfolio(portfolioId) {
  selectedPortfolioId = portfolioId;
  const items = document.querySelectorAll('#savedPortfoliosList li');
  items.forEach(item => item.classList.remove('bg-white/20'));
  const selectedItem = document.querySelector(`#savedPortfoliosList li[onclick="selectPortfolio('${portfolioId}')"]`);
  if (selectedItem) {
    selectedItem.classList.add('bg-white/20');
  }
  downloadPortfolioPDF(portfolioId);
}

async function downloadSelectedPortfolio() {
  if (selectedPortfolioId) {
    await downloadPortfolioPDF(selectedPortfolioId);
    closeSavedPortfoliosModal();
  } else {
    alert('Please select a portfolio to download.');
  }
}

async function downloadPortfolioPDF(portfolioId) {
  try {
    const response = await fetch(`http://localhost:5000/api/portfolios/${portfolioId}`);
    if (response.ok) {
      const portfolio = await response.json();
      const element = document.createElement('div');
      element.innerHTML = `
        <div>
          <h3>${portfolio.fullName}</h3>
          <p>${portfolio.contactInfo}</p>
          <p>${portfolio.bio}</p>
          <p>${portfolio.skills}</p>
          <p>${portfolio.education}</p>
          <p>${portfolio.experience}</p>
          <p>${portfolio.projects}</p>
          ${portfolio.imagePreview ? `<img src="${portfolio.imagePreview}" alt="Profile">` : ''}
        </div>
      `;
      const opt = {
        margin: 0.5,
        filename: `${portfolio.fullName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(element).set(opt).save();
    } else {
      console.error('Failed to fetch portfolio');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function downloadPDF() {
  // Update the portfolio preview with the latest data
  updatePortfolioPreview();

  // Ensure the portfolio preview is visible
  const modal = document.getElementById('portfolioModal');
  const content = modal.querySelector('.modal-content');
  modal.classList.remove('hidden');
  content.classList.add('show');
}

function confirmPreview(isConfirmed) {
  const modal = document.getElementById('portfolioModal');
  const content = modal.querySelector('.modal-content');

  if (isConfirmed) {
    console.log('Preview confirmed');
    // Perform the download action
    const element = document.getElementById('portfolioPreview');
    const opt = {
      margin: 0.5,
      filename: 'portfolio.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Use html2pdf to generate and download the PDF
    html2pdf().from(element).set(opt).save();
  } else {
    console.log('Preview canceled');
  }

  content.classList.remove('show');
  modal.classList.add('hidden');
}

// Portfolio preview modal
function togglePortfolioView() {
  if (!showPortfolio) {
    setShowPortfolio(true);
  }
}

function setShowPortfolio(show) {
  const modal = document.getElementById('portfolioModal');
  const content = modal.querySelector('.modal-content');

  if (show) {
    clearTimeout(hideTimer);
    showPortfolio = true;
    isHiding = false;
    modal.classList.remove('hidden');
    setTimeout(() => content.classList.add('show'), 10);
    updatePortfolioPreview();
  } else {
    clearTimeout(hideTimer);
    content.classList.remove('show');
    setTimeout(() => {
      modal.classList.add('hidden');
      showPortfolio = false;
      isHiding = false;
    }, 300);
  }
}

function updatePortfolioPreview() {
  const previewContainer = document.getElementById('portfolioPreview');
  const getValue = (id) => document.getElementById(id)?.value || 'Not provided';

  previewContainer.innerHTML = `
    ${imagePreview
      ? `
        <div class="flex justify-center mb-6">
          <img src="${imagePreview}" alt="Profile" class="w-40 h-40 rounded-full object-cover border-4 border-white/30 shadow-lg hover:border-pink-400/50 transition-all duration-300">
        </div>
      `
      : ''
    }
    <div>
      <h3 class="text-white/90 font-medium">Full Name</h3>
      <p class="text-white">${getValue('fullName')}</p>
    </div>
    <div>
      <h3 class="text-white/90 font-medium">Contact Information</h3>
      <p class="text-white">${getValue('contactInfo')}</p>
    </div>
    <div>
      <h3 class="text-white/90 font-medium">Bio</h3>
      <p class="text-white">${getValue('bio')}</p>
    </div>
    <div>
      <h3 class="text-white/90 font-medium">Skills</h3>
      <p class="text-white">${getValue('skills')}</p>
    </div>
    <div>
      <h3 class="text-white/90 font-medium">Education</h3>
      <p class="text-white">${getValue('education')}</p>
    </div>
    <div>
      <h3 class="text-white/90 font-medium">Experience</h3>
      <p class="text-white">${getValue('experience')}</p>
    </div>
    <div>
      <h3 class="text-white/90 font-medium">Projects</h3>
      <p class="text-white">${getValue('projects')}</p>
    </div>
  `;
}

async function showSavedPortfolios() {
  try {
    const response = await fetch('http://localhost:5000/api/portfolios');
    if (response.ok) {
      const portfolios = await response.json();
      displayPortfolios(portfolios);
      const modal = document.getElementById('savedPortfoliosModal');
      const content = modal.querySelector('.modal-content');
      modal.classList.remove('hidden');
      setTimeout(() => content.classList.add('show'), 10);
    } else {
      console.error('Failed to fetch portfolios');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function closeSavedPortfoliosModal() {
  const modal = document.getElementById('savedPortfoliosModal');
  const content = modal.querySelector('.modal-content');
  content.classList.remove('show');
  setTimeout(() => modal.classList.add('hidden'), 300);
}
