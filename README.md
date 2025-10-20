# 📚 BookWise - AI-Powered Book Recommender

> Discover your next favorite book with intelligent recommendations tailored just for you! 🤖✨

## 🌟 Features

### 🔍 Smart Book Discovery
- **AI-powered search** using Google Books API
- **Advanced filtering** by category, language, print type, and sorting options
- **Voice search** capability for hands-free browsing
- **Quick search suggestions** with popular genres and trending topics

### 📖 Personal Library Management
- **My Library** - Save books to your personal collection
- **Favorites** - Mark books you love with a heart
- **Reading History** - Track your reading journey
- **Reading Status** - Organize books by "Want to Read", "Currently Reading", and "Finished"

### 🎯 Intelligent Recommendations
- **Personalized suggestions** based on your reading preferences
- **Similar book finder** - Enter a book title to find related recommendations
- **Category-based discovery** - Explore books in your favorite genres

### 📊 Reading Statistics
- Track total books discovered
- Monitor library growth
- View favorite book counts
- Reading progress analytics

### 🎨 Modern UI/UX
- **Responsive design** that works on all devices
- **Beautiful gradient backgrounds** and smooth animations
- **Interactive book cards** with hover effects
- **Modal book details** with comprehensive information
- **Intuitive navigation** between Discover, Library, and Recommendations sections

## 🚀 Demo

#![BookWise Demo](https://via.placeholder.com/800x400?text=BookWise+Demo+Screenshot)
<img width="1883" height="1083" alt="image" src="https://github.com/user-attachments/assets/a4e8fb9a-dd04-4afe-b161-10e881032392" />




*Experience the magic of personalized book discovery!*

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: Google Books API
- **Storage**: Local Storage for user data persistence
- **Design**: CSS Grid, Flexbox, CSS Variables
- **Features**: Responsive Design, Progressive Web App ready

## 🎯 How to Use

### 🔍 Discovering Books
1. **Search**: Enter any book title, author, or keyword
2. **Filter**: Use advanced filters for precise results
3. **Browse**: Explore curated suggestions and trending topics
4. **Voice Search**: Click the microphone icon for voice input

### 📚 Managing Your Library
1. **Add to Library**: Click the bookmark icon on any book card
2. **Favorite Books**: Click the heart icon to mark favorites
3. **View Details**: Click on any book card for detailed information
4. **Organize**: Use the Library tab to manage your collection

### 🎯 Getting Recommendations
1. **Personal Recommendations**: Visit the Recommendations tab
2. **Similar Books**: Enter a book title to find similar reads
3. **AI Suggestions**: Explore personalized picks based on your history

## 🌈 Key Highlights

### 🎨 Design Features
- **Gradient Backgrounds**: Beautiful purple-to-pink gradients
- **Smooth Animations**: CSS transitions and hover effects
- **Card-based Layout**: Modern, Pinterest-style book grid
- **Glassmorphism**: Semi-transparent elements with blur effects

### ⚡ Performance Features
- **Fast Loading**: Optimized image loading and caching
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Local Storage**: Instant access to your personal data

### 🔧 Technical Features
- **Modular JavaScript**: Clean, maintainable code structure
- **CSS Variables**: Consistent theming and easy customization
- **Error Handling**: Robust API error management
- **Accessibility**: Keyboard navigation and screen reader support


## 🚀 Future Enhancements

- [ ] 📱 **Mobile App** - React Native version
- [ ] 🔐 **User Authentication** - Save data across devices
- [ ] 📊 **Advanced Analytics** - Reading patterns and insights
- [ ] 💬 **Book Reviews** - Community ratings and reviews
- [ ] 🎯 **ML Recommendations** - Enhanced AI recommendation engine
- [ ] 📚 **Reading Lists** - Create and share custom book lists
- [ ] 🌙 **Dark Mode** - Eye-friendly dark theme
- [ ] 🔔 **Notifications** - New book alerts and reading reminders

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📄 API Usage

This project uses the [Google Books API](https://developers.google.com/books) for book data:


// Example API call
const searchBooks = async (query) => {
const response = await fetch(
https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40
);
const data = await response.json();
return data.items;
};


## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- 📚 **Google Books API** for providing comprehensive book data
- 🎨 **Inter Font** for beautiful typography
- 🌈 **CSS Gradients** for stunning visual effects
- 💡 **Open Source Community** for inspiration and resources


### 🌟 Star this repository if you found it helpful! 🌟

**Made with ❤️**

*Happy Reading! 📚✨*
