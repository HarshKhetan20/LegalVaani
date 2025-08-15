document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            document.querySelector('.auth-buttons').style.display = 'none';
            document.querySelector('.user-info').style.display = 'flex';
            
            // Load user data
            const userData = JSON.parse(localStorage.getItem('user')) || {};
            document.getElementById('user-name').textContent = userData.name || user.displayName || 'User Name';
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('full-name').value = userData.name || user.displayName || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = userData.phone || '';
            document.getElementById('location').value = userData.location || '';
        } else {
            // No user is signed in
            window.location.href = 'home.html';
        }
    });

    // Update Profile Handler
    document.querySelector('.update-btn').addEventListener('click', () => {
        const user = firebase.auth().currentUser;
        if (!user) return;

        const updatedUser = {
            name: document.getElementById('full-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value
        };

        // Update email if changed
        if (updatedUser.email !== user.email) {
            user.updateEmail(updatedUser.email)
                .then(() => {
                    console.log('Email updated successfully');
                })
                .catch((error) => {
                    alert('Error updating email: ' + error.message);
                    return;
                });
        }

        // Update other profile data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
    });

    // Change Password Handler
    document.querySelector('.change-password-btn').addEventListener('click', () => {
        const newPassword = prompt('Enter new password:');
        if (!newPassword) return;

        const user = firebase.auth().currentUser;
        user.updatePassword(newPassword)
            .then(() => {
                alert('Password updated successfully!');
            })
            .catch((error) => {
                // If error requires recent login
                if (error.code === 'auth/requires-recent-login') {
                    const email = user.email;
                    const currentPassword = prompt('For security, please enter your current password:');
                    if (!currentPassword) return;

                    // Reauthenticate user
                    const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
                    user.reauthenticateWithCredential(credential)
                        .then(() => {
                            // Retry password update
                            return user.updatePassword(newPassword);
                        })
                        .then(() => {
                            alert('Password updated successfully!');
                        })
                        .catch((error) => {
                            alert('Error updating password: ' + error.message);
                        });
                } else {
                    alert('Error updating password: ' + error.message);
                }
            });
    });

    // Logout Handler
    document.querySelector('.logout-btn').addEventListener('click', () => {
        firebase.auth().signOut()
            .then(() => {
                localStorage.removeItem('user');
                window.location.href = 'home.html';
            })
            .catch((error) => {
                alert('Error signing out: ' + error.message);
            });
    });
});
