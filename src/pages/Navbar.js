import React, { useState } from 'react';
import GroupPanel from './GroupPanel';
import OptionsDropdown from './OptionsDropdown';

function Navbar(props) {
    // state of the account options' display
    const [isDisplayed, setIsDisplayed] = useState(false);

    // should show GroupPanel or not
    const [panelDisplay, setPanelDisplay] = useState(true);

    const togglePanelDisplay = () => {
        setPanelDisplay(!panelDisplay);
    }

    const showOptions = () => {
        setIsDisplayed(!isDisplayed);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') showOptions();
    }

    const selectGroup = (groupName) => {
        props.showGroupContent(groupName);
    }

    return (
        <>
            <nav className="nav">
                <i onClick={togglePanelDisplay} className="fas fa-bars nav__menu-icon"></i>
                <span className="nav__title">Organizr</span>
                <i className="fas fa-user-circle fa-2x nav__account-icon" onClick={showOptions} onKeyDown={handleKeyDown} tabIndex="0"></i>
                { isDisplayed && <OptionsDropdown /> }
            </nav>
            {panelDisplay && <GroupPanel showCorrectGroup={selectGroup} closePanel={togglePanelDisplay} />}
        </>
    );
}

export default Navbar;