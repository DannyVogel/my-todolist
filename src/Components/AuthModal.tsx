import { useState } from 'react'
import { auth, updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../../firebase';

type Props = {
    loggedIn: boolean,
    user: string,
    userUID: string,
    setUserUID: (userUID: string) => void,
    setUser: (user: string) => void,
    setLoggedIn: (loggedIn: boolean) => void,
}

interface SignInFormData {
    signInEmail: string;
    signInPassword: string;
}

interface SignUpFormData {
    signUpEmail: string;
    signUpPassword: string;
    name: string;
  }
  
  type SetSignInFormData = React.Dispatch<React.SetStateAction<SignInFormData>>;
  type SetSignUpFormData = React.Dispatch<React.SetStateAction<SignUpFormData>>;
  

export default function AuthModal(props: Props) {
    const [signInMethod, setSignInMethod] = useState<boolean>(true)
    
    const [signInFormData, setSignInFormData]: [SignInFormData, SetSignInFormData] = useState({
        signInEmail: '', signInPassword: ''
    })
    const [signUpFormData, setSignUpFormData]: [SignUpFormData, SetSignUpFormData] = useState({
        signUpEmail: '', signUpPassword: '', name: ''
    })

    const [errorMessage, setErrorMessage] = useState<string>('')

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        const {name, value, id} = e.target
        const selectForm = id.slice(0,6)
        if(selectForm == "signIn"){
            setSignInFormData(prevFormData => ({...prevFormData, [name]: value}))
        } else {
            setSignUpFormData(prevFormData => ({...prevFormData, [name]: value}))
        }
    }

    function processSignInFormData(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        signInWithEmailAndPassword(auth, signInFormData.signInEmail, signInFormData.signInPassword)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                props.setUser(user.displayName!)
                props.setLoggedIn(true)
                props.setUserUID(userCredential.user?.uid!)
            })
            .catch((error) => {
                setErrorMessage('Incorrect email or password');
                setTimeout(() => {
                    setErrorMessage('')
                }, 3000)
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)

            });
    }

    function processSignUpFormData(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        setErrorMessage('')
        createUserWithEmailAndPassword(auth, signUpFormData.signUpEmail, signUpFormData.signUpPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            updateProfile(auth.currentUser!, {
                displayName: signUpFormData.name
            }).then(() => {
                props.setUser(user.displayName!)
            })
            props.setLoggedIn(true)
            props.setUserUID(userCredential.user?.uid!)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            // ..
        });
    }

    function switchSignInMethod(){
        setSignInMethod(prev => !prev)
    }

    function logInAsGuest(){
        signInWithEmailAndPassword(auth, 'guest@guest.com', '123456')
        .then((userCredential) => {
            props.setUser("Guest")
            props.setLoggedIn(true)
            props.setUserUID(userCredential.user?.uid!)
        })
        .catch((error) => {
            setErrorMessage('Incorrect email or password');
            setTimeout(() => {
                setErrorMessage('')
            }, 3000)
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)

        });
    }

  return (
    <div className="modal-overlay">
        <div className="profileModalContainer">
                <div className='logInContainer'>
                    {signInMethod
                    ?   <form onSubmit={processSignInFormData}>
                            <fieldset className='logInForm'>
                                <legend>Sign In</legend>
                                <label htmlFor="signInEmail" className="">Email:</label>
                                <input type="email" name="signInEmail" id="signInEmail" value={signInFormData.signInEmail} onChange={handleChange}/>
                                <label htmlFor="signInPassword" className="">Password:</label>
                                <input type="password" name="signInPassword" id="signInPassword" value={signInFormData.signInPassword} onChange={handleChange}/>
                                <p className='errorMessage'>{errorMessage ? errorMessage : '\u00A0'}</p>
                                <button className='logInBtn btn'>Sign In</button>
                            </fieldset>
                        </form>
                    :   <form onSubmit={processSignUpFormData}>
                            <fieldset className='logInForm'>
                                <legend>Sign Up</legend>
                                <label htmlFor="name" className="">Name:</label>
                                <input type="text" name="name" id="name" value={signUpFormData.name} onChange={handleChange} required/>
                                <label htmlFor="signUpEmail" className="">Email:</label>
                                <input type="email" name="signUpEmail" id="signUpEmail" value={signUpFormData.signUpEmail} onChange={handleChange}/>
                                <label htmlFor="signUpPassword" className="">Password:</label>
                                <input type="password" name="signUpPassword" id="signUpPassword" value={signUpFormData.signUpPassword} onChange={handleChange}/>
                                <button className='logInBtn btn'>Sign up</button>
                            </fieldset>
                        </form>
                    }
                  <div className="textContainer">
                      {signInMethod ? <p className='logInMethodTxt' onClick={switchSignInMethod}>New user? Sign up here</p> : <p className='logInMethodTxt' onClick={switchSignInMethod}>Already a user? Sign in here</p>}
                      {signInMethod && <p className='logInMethodTxt' onClick={logInAsGuest}>Log in as Guest</p>}
                  </div>
                </div>
        </div>
    </div>
  )
}

