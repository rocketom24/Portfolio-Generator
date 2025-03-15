// Global variables
let imagePreview = '';
let showPortfolio = false;
let isHiding = false;
let hideTimer;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Set up image upload handler
  const imagePreviewContainer = document.getElementById(
    'imagePreviewContainer'
  );
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
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>`;
  }
}

// Portfolio actions
function generatePortfolio() {
  console.log('Generating portfolio...');
}

function savePortfolio() {
  console.log('Saving portfolio...');
}

function downloadPDF() {
  console.log('Downloading PDF...');
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

    // Auto-hide after 3 seconds
    hideTimer = setTimeout(() => {
      isHiding = true;
      content.classList.remove('show');
      setTimeout(() => {
        modal.classList.add('hidden');
        showPortfolio = false;
        isHiding = false;
      }, 300);
    }, 3000);
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
        ${
          imagePreview
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
