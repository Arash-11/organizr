import React , { useState , useEffect } from 'react';
import GroupPanel from './GroupPanel';
import LinkModal from './LinkModal';
import { db , auth } from '../Firebase';

function TopicContent () {
    // to determine currently selected group
    const [currentGroup, setCurrentGroup] = useState('');

    // will store main data for selected group
    const [groupContent, setGroupContent] = useState([]);

    // to determine if modal to add link/URL is open or closed
    const [isDisplayed, setIsDisplayed] = useState(false);

    let userID;
    auth.onAuthStateChanged((user) => {
        if (user) userID = user.uid; // User is signed in.
        else return;
    });

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                db.collection(userID)
                    .doc('groups')
                    .collection(currentGroup)
                    .get()
                    .then(doc => {
                        doc.forEach(link => {
                            setGroupContent(prevValue => {
                                return [
                                    ...prevValue,
                                    {
                                        'title': link.data().title,
                                        'url': link.data().url
                                    }
                                ]
                            });
                        });
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
            }
            else return;
        });

        // cleanup function
        const removePreviousContent = () => {
            setGroupContent([]);
        }
        return removePreviousContent();

    }, [currentGroup, userID]);


    const showGroupContent = (groupName) => {
        setCurrentGroup(groupName);
    }

    const toggleModalDisplay = () => {
        setIsDisplayed(!isDisplayed);
    }

    const submitLinkDetails = (linkDetails) => {
        if (userID) {
            db.collection(userID)
                .doc('groups')
                .collection(currentGroup)
                .add({
                    title: linkDetails.title,
                    url: linkDetails.url
                })
                .then(() => {
                    console.log('Data has been successfully added to database!');
                    setGroupContent((prevValue) => {
                        return [
                            ...prevValue,
                            {
                                'title': linkDetails.title,
                                'url': linkDetails.url
                            }
                        ]
                    });
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        }
        // when user is not signed in - this will allow user to test the website without creating an account
        else {
            setGroupContent((prevValue) => {
                return [
                    ...prevValue,
                    {
                        'title': linkDetails.title,
                        'url': linkDetails.url
                    }
                ]
            });
        }
    }

    return (
        <>
            <GroupPanel selectGroup={showGroupContent} />
            { isDisplayed && <LinkModal submitData={submitLinkDetails} closeModal={toggleModalDisplay} /> }
            <div className="topic-content">
                {groupContent.map((link) => {
                    return (
                        <div key={groupContent.indexOf(link)} className="topic-content__link">
                            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                        </div>
                    );
                })}
                <button onClick={toggleModalDisplay} className="topic-content__add-button">
                    <i className="fas fa-plus"></i>
                </button>
            </div>
        </>
    );
}

export default TopicContent;