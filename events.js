window.onload = function(){

    let leftNotesCount = 0;
    let midNotesCount = 0;
    let rightNotesCount = 0;
    let openNoteId = "";
    let notes = [];

    document.getElementById("addLeft").addEventListener("click", function() {addNote("left")});

    document.getElementById("addMid").addEventListener("click", function() {addNote("mid")});

    document.getElementById("addRight").addEventListener("click", function() {addNote("right")});

    function addNote(position)
    {
        let lastNoteLeft = document.getElementById("leftSection").lastElementChild;
        let lastNoteMid = document.getElementById("midSection").lastElementChild;
        let lastNoteRight = document.getElementById("rightSection").lastElementChild;

        if(lastNoteLeft!= null && lastNoteLeft.firstChild.innerHTML=="")
        {
            document.getElementById(lastNoteLeft.id).remove();
            leftNotesCount--;
        }

        if(lastNoteMid != null && lastNoteMid.firstChild.innerHTML=="")
        {
            document.getElementById(lastNoteMid.id).remove();
            midNotesCount--;
        }

        if(lastNoteRight != null && lastNoteRight.firstChild.innerHTML=="")
        {
            document.getElementById(lastNoteRight.id).remove();
            rightNotesCount--;
        }

        let section = position + "Section";
        let lastNote = document.getElementById(section).lastElementChild;

        if(lastNote == null || lastNote.firstChild.innerHTML!="")
        {
            let count = 0;
            if(position == "left")
            {
                leftNotesCount++;
                count = leftNotesCount;
            }
            else if(position == "mid")
            {
                midNotesCount++;
                count = midNotesCount;
            }
            else
            {
                rightNotesCount++;
                count = rightNotesCount;
            }

            let note = document.createElement("DIV");
            note.className += "note-item ";
            note.className += position;
            note.id = position + "_" + count;

            let content = document.createElement("P");
            content.className += "note";

            let likes = document.createElement("P");
            likes.className += "likesCounter ";
            likes.innerText = "+0";

            note.appendChild(content);
            note.appendChild(likes);

            document.getElementById(section).appendChild(note);
        }

    }

    document.addEventListener("click", function(event)
        {
            if (hasClass(event.target, 'left')) {
                openNote(event, "leftOpenNote");
            }
            else if (hasClass(event.target, 'mid')) {
                openNote(event, "midOpenNote");
            }
            else if(hasClass(event.target, 'right')) {
                openNote(event, "rightOpenNote");
            }
        });

    function hasClass(element, className) {
        return element.className.split(' ').indexOf(className) > -1;
    }

    function openNote(event, id)
    {
        let note = document.getElementById("openNote");
        let blur = document.getElementById("blur");

        note.style.display = "block";
        blur.style.display = "block";

        note.className += id + " ";
        openNoteId = event.target.id;

        let openNoteObject = notes.find(x => x.id == openNoteId);
        if(openNoteObject == undefined)
        {
            let newNote = {
                id : openNoteId,
                likes : 0,
                content : "",
                section : id
            }
            openNoteObject = newNote;
            notes.push(newNote);
        }
        let contentArea = document.getElementById("openNoteContent");
        contentArea.value = openNoteObject.content;
        contentArea.autofocus = true;

        let openLike = document.getElementById("openNoteLike");
        openLike.innerText = "+" + openNoteObject.likes;
    }

    document.getElementById("close").addEventListener("click", function() {closeNote()});

    function closeNote()
    {
        let note = document.getElementById("openNote");
        let blur = document.getElementById("blur");

        note.style.display = "none";
        blur.style.display = "none";

        note.className = "";

        let openNoteContentObject = notes.find(x => x.id == openNoteId);
        let contentArea = document.getElementById("openNoteContent");
        openNoteContentObject.content = contentArea.value;

        let openNote = document.getElementById(openNoteId);
        openNote.firstElementChild.innerText = contentArea.value;
        openNote.lastElementChild.innerText = "+" + openNoteContentObject.likes;
    }

    document.getElementById("like").addEventListener("click", function () { increaseLikeCount()});

    function increaseLikeCount()
    {
        let openNoteContentObject = notes.find(x => x.id == openNoteId);
        openNoteContentObject.likes++;

        let openLike = document.getElementById("openNoteLike");
        openLike.innerText = "+" + openNoteContentObject.likes;

        let openNote = document.getElementById(openNoteId);
        openNote.lastElementChild.innerText = "+" + openNoteContentObject.likes;

        sort();
    }

    document.getElementById("delete").addEventListener("click", function() {deleteNote()});

    function deleteNote()
    {
        notes = notes.filter(note => note.id != openNoteId);
        document.getElementById(openNoteId).remove();

        let note = document.getElementById("openNote");
        let blur = document.getElementById("blur");

        note.style.display = "none";
        blur.style.display = "none";

        note.className = "";
    }

    document.getElementById("blur").addEventListener("click", function() {closeNote()});

    document.getElementById("filter").addEventListener("input", function(event) {filter(event)});

    function filter(event)
    {
        let input = event.target.value;
        let allNotes = document.getElementsByClassName("note");

        Array.from(allNotes).forEach(element => {
            if(!element.innerText.includes(input))
            {
                element.parentElement.style.display = "none";
            }
            if(input == "")
            {
                element.parentElement.style.display = "block";
            }
        });
    }

    document.getElementById("sections").addEventListener("change", function(event) {selectSection(event)});

    function selectSection(event)
    {
        let input = event.target.value;
        let left = document.getElementById("leftSection");
        let mid = document.getElementById("midSection");
        let right = document.getElementById("rightSection");

        if(input == "1")
        {
            left.style.display = "";
            mid.style.display = "none";
            right.style.display = "none";
        }
        else if(input == "2")
        {
            left.style.display = "none";
            mid.style.display = "";
            right.style.display = "none";
        }
        else if(input == "3")
        {
            left.style.display = "none";
            mid.style.display = "none";
            right.style.display = "";
        }
        else
        {
            left.style.display = "";
            mid.style.display = "";
            right.style.display = "";
        }
    }

    document.getElementById("sort").addEventListener("change", function() {sort()});

    function sort()
    {
        let sort = document.getElementById("sort").value;

        if(sort == "1")
        {
            setSortedNotes(notes);
        }
        else if(sort == "2")
        {
            let noteObjects = notes.slice();
            noteObjects.sort(function(a, b) {
                return b.likes - a.likes;
            });

            setSortedNotes(noteObjects);
        }
    }

    function setSortedNotes(allNotes)
    {
        let leftsection = [];
        let midSection = [];
        let rightSection = [];

        Array.from(allNotes).forEach(element => {
            let note = document.getElementById(element.id);

            if(element.section == "leftOpenNote")
            {
                leftsection.push(note);
            }
            else if(element.section == "midOpenNote")
            {
                midSection.push(note);
            }
            else if(element.section == "rightOpenNote")
            {
                rightSection.push(note);
            }
        });

        let leftSide = document.getElementById("leftSection");
        leftSide.innerHTML = "";
        let rightSide = document.getElementById("rightSection");
        rightSide.innerHTML = "";
        let midSide = document.getElementById("midSection");
        midSide.innerHTML = "";

        Array.from(leftsection).forEach(item => {
            leftSide.appendChild(item);
        });

        Array.from(midSection).forEach(item => {
            midSide.appendChild(item);
        });

        Array.from(rightSection).forEach(item => {
            rightSide.appendChild(item);
        });
    }
    
}