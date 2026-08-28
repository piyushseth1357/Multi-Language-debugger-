#!/usr/bin/env node
#!/usr/bin/env node
"use strict";

// ../core-engine/src/data/patterns/compile-errors.json
var compile_errors_default = [
  {
    id: "py_expected_indented_block",
    category: "compile",
    keywords: ["Expected indented block"],
    causeKey: "py_expected_indented_block_cause",
    fixKey: "py_expected_indented_block_fix",
    exampleFixCode: "        pass"
  },
  {
    id: "py_unexpected_indentation",
    category: "compile",
    keywords: ["Unexpected indentation"],
    causeKey: "py_unexpected_indentation_cause",
    fixKey: "py_unexpected_indentation_fix",
    exampleFixCode: "    # Indentation auto-aligned (4 spaces)"
  },
  {
    id: "py_return_outside_function",
    category: "compile",
    keywords: ['"return" can be used only within a function'],
    causeKey: "py_return_outside_function_cause",
    fixKey: "py_return_outside_function_fix",
    exampleFixCode: "    # Move return statement inside function def"
  },
  {
    id: "py_const_statement_error",
    category: "compile",
    keywords: ["Statements must be separated by newlines or semicolons"],
    causeKey: "py_const_statement_cause",
    fixKey: "py_const_statement_fix",
    exampleFixCode: "x = user15"
  },
  {
    id: "py_const_not_defined",
    category: "compile",
    keywords: ['"const" is not defined'],
    causeKey: "py_const_statement_cause",
    fixKey: "py_const_statement_fix",
    exampleFixCode: "x = user15"
  },
  {
    id: "ts_cannot_find_name",
    category: "compile",
    keywords: ["Cannot find name", "TS2304"],
    regex: `Cannot find name ['"]?(\\w+)['"]?`,
    causeKey: "ts_cannot_find_name_cause",
    fixKey: "ts_cannot_find_name_fix",
    exampleFixCode: "import { $1 } from './$1';"
  },
  {
    id: "ts_property_does_not_exist",
    category: "compile",
    keywords: ["Property", "does not exist on type", "TS2339"],
    regex: `Property ['"]?(\\w+)['"]? does not exist on type ['"]?(\\w+)['"]?`,
    causeKey: "ts_property_does_not_exist_cause",
    fixKey: "ts_property_does_not_exist_fix",
    exampleFixCode: "interface $2 {\n  $1?: string;\n}"
  },
  {
    id: "py_syntax_error",
    category: "compile",
    keywords: ["SyntaxError: invalid syntax", "SyntaxError:"],
    regex: "SyntaxError: invalid syntax",
    causeKey: "py_syntax_error_cause",
    fixKey: "py_syntax_error_fix",
    exampleFixCode: "    pass"
  },
  {
    id: "py_indentation_error",
    category: "compile",
    keywords: ["IndentationError: unexpected indent", "IndentationError:"],
    regex: "IndentationError: (\\w+)",
    causeKey: "py_indentation_error_cause",
    fixKey: "py_indentation_error_fix",
    exampleFixCode: "    pass"
  }
];

// ../core-engine/src/data/patterns/runtime-errors.json
var runtime_errors_default = [
  {
    id: "js_cannot_read_property_undefined",
    category: "runtime",
    keywords: ["Cannot read property", "Cannot read properties of undefined", "TypeError"],
    regex: `Cannot read properties? of undefined \\(reading ['"]?(\\w+)['"]?\\)`,
    causeKey: "js_undefined_prop_cause",
    fixKey: "js_undefined_prop_fix",
    exampleFixCode: "// Use optional chaining:\nconst value = object?.$1;"
  },
  {
    id: "py_name_error",
    category: "runtime",
    keywords: ["NameError: name", "is not defined"],
    regex: `NameError: name ['"]?(\\w+)['"]? is not defined`,
    causeKey: "py_name_error_cause",
    fixKey: "py_name_error_fix",
    exampleFixCode: "# Define variable before using or import missing module:\n$1 = None"
  },
  {
    id: "py_module_not_found",
    category: "runtime",
    keywords: ["ModuleNotFoundError: No module named"],
    regex: `ModuleNotFoundError: No module named ['"]?(\\w+)['"]?`,
    causeKey: "py_module_not_found_cause",
    fixKey: "py_module_not_found_fix",
    exampleFixCode: "pip install $1"
  },
  {
    id: "node_port_eaddrinuse",
    category: "runtime",
    keywords: ["EADDRINUSE", "address already in use"],
    regex: "EADDRINUSE:? address already in use (?::::)?(\\d+)?",
    causeKey: "node_eaddrinuse_cause",
    fixKey: "node_eaddrinuse_fix",
    exampleFixCode: "# Kill process using the port (Windows):\nnpx kill-port $1"
  }
];

// ../core-engine/src/data/patterns/git-errors.json
var git_errors_default = [
  {
    id: "git_push_rejected",
    category: "git",
    keywords: ["push", "rejected", "non-fast-forward", "fetch first"],
    regex: "updates were rejected because the remote contains work",
    causeKey: "git_push_rejected_cause",
    fixKey: "git_push_rejected_fix",
    exampleFixCode: "git pull --rebase origin main\ngit push origin main"
  },
  {
    id: "git_merge_conflict",
    category: "git",
    keywords: ["merge conflict", "Automatic merge failed", "CONFLICT"],
    regex: "CONFLICT \\(content\\): Merge conflict in (.+)",
    causeKey: "git_merge_conflict_cause",
    fixKey: "git_merge_conflict_fix",
    exampleFixCode: '# Resolve conflict markers in file, then run:\ngit add $1\ngit commit -m "Fix merge conflicts"'
  },
  {
    id: "git_detached_head",
    category: "git",
    keywords: ["HEAD detached", "detached HEAD"],
    regex: "You are in 'detached HEAD' state",
    causeKey: "git_detached_head_cause",
    fixKey: "git_detached_head_fix",
    exampleFixCode: "git switch -c new-feature-branch"
  },
  {
    id: "git_permission_denied",
    category: "git",
    keywords: ["Permission denied (publickey)", "Authentication failed"],
    regex: "Permission denied \\(publickey\\)|Authentication failed",
    causeKey: "git_auth_failed_cause",
    fixKey: "git_auth_failed_fix",
    exampleFixCode: "# Check SSH key or update credentials:\nssh-add ~/.ssh/id_ed25519"
  }
];

// ../core-engine/src/data/locales/hi.json
var hi_default = {
  name: "Hinglish / Hindi",
  ui: {
    title: "Multi-Language Error Debugger",
    fileLabel: "File",
    lineLabel: "Line",
    problemLabel: "Problem Summary",
    causeLabel: "Wajah (Cause)",
    fixLabel: "Solution (Fix Steps)",
    confidenceLabel: "Confidence",
    applyFixBtn: "Apply Fix in Editor",
    copyFixBtn: "Copy Solution Code",
    askAiPlaceholder: "Koyi sawaal poocho is error ke baare mein...",
    askAiBtn: "Poocho (Ask AI)",
    tierPattern: "Tier 1: Local Pattern Matcher (Offline / Free)",
    tierLlm: "Tier 2: AI Fallback Engine",
    noErrorYet: "Abhi tak koi error detect nahi hua hai. Jab compile, runtime ya git error aayega toh explanation yahan auto-appear hoga."
  },
  patterns: {
    ts_cannot_find_name_cause: "Aap jo variable, class ya function use kar rahe hain, woh declare ya import nahi kiya gaya hai.",
    ts_cannot_find_name_fix: [
      "File ke top par check karein ki required module/variable import hai ya nahi.",
      "Variable name me spelling mistake check karein.",
      "Agar external library hai toh `@types/package` install karein."
    ],
    ts_property_does_not_exist_cause: "Object ke paas woh property ya method exist nahi karta jo aap access karne ki koshish kar rahe hain.",
    ts_property_does_not_exist_fix: [
      "Property ki spelling check karein.",
      "Interface/Type definition me field ko add karein.",
      "Optional chaining (`?.`) ka use karein agar object undefined ho sakta hai."
    ],
    py_expected_indented_block_cause: "Python me block (if, for, def, class) ke neeche 4 spaces ki indentation zaroori hoti hai.",
    py_expected_indented_block_fix: [
      "Block statement ke neeche 4 spaces ka gap/indentation dein.",
      "Indented block me valid statement ya `pass` likhein."
    ],
    py_unexpected_indentation_cause: "Line ke start me extra spaces hain jisse Python indentation alignment bigad gaya hai.",
    py_unexpected_indentation_fix: [
      "Line ke start se extra spaces remove karke 4-space block align karein."
    ],
    py_return_outside_function_cause: "`return` statement kisi function (def) ke bahar likha gaya hai.",
    py_return_outside_function_fix: [
      "`return` statement ko `def` function ke andar move karein ya remove karein."
    ],
    py_const_statement_cause: "Python me 'const' ya 'let' keyword use nahi hota. Aap Python file (.py) me JavaScript syntax likh rahe hain.",
    py_const_statement_fix: [
      "Line ke start se 'const' ya 'let' keyword ko remove karein.",
      "Python me direct variable assignment syntax use karein: x = user15"
    ],
    py_syntax_error_cause: "Python interpreter ko code structure me invalid syntax mila hai (jaise missing colon, unmatched parenthesis).",
    py_syntax_error_fix: [
      "Statement (if, for, def, class) ke end par colon `:` miss toh nahi hai dekhein.",
      'Parentheses `()`, brackets `[]`, aur quotes `""` properly closed hain ya nahi check karein.'
    ],
    py_indentation_error_cause: "Python me spaces ya tabs properly align nahi hain.",
    py_indentation_error_fix: [
      "Har block me strictly 4 spaces ka indentation use karein.",
      "Tabs aur Spaces ko mix na karein."
    ],
    js_undefined_prop_cause: "Aap kisi undefined ya null object se property read kar rahe hain.",
    js_undefined_prop_fix: [
      "Access karne se pehle check karein ki object exist karta hai ya nahi.",
      "Optional chaining operator `?.` ka upayog karein (e.g. `obj?.prop`).",
      "Object ko default value assigning karein."
    ],
    py_name_error_cause: "Aap aise variable/function ko access kar rahe hain jo code me pehle define nahi kiya gaya.",
    py_name_error_fix: [
      "Variable ko use karne se pehle assign/define karein.",
      "Agar external module hai toh `import` statement lagayein."
    ],
    py_module_not_found_cause: "Python environment me required module/package missing hai.",
    py_module_not_found_fix: [
      "Terminal me `pip install <module-name>` chalayein.",
      "Virtual environment activated hai ya nahi verify karein."
    ],
    node_eaddrinuse_cause: "Aapka Node server jis port par start hone ki koshish kar raha hai, woh port pehle se kisi aur process dwara occupied hai.",
    node_eaddrinuse_fix: [
      "Terminal me old server process ko stop karein.",
      "Ya `npx kill-port <port>` command chalayein.",
      "Ya application configuration me doosra port select karein."
    ],
    git_push_rejected_cause: "Remote repository me naye commits hain jo aapke local branch par missing hain.",
    git_push_rejected_fix: [
      "Pehle remote changes pull karein: `git pull --rebase origin main`",
      "Conflicts solve karein agar aayein.",
      "Fir se push karein: `git push origin main`"
    ],
    git_merge_conflict_cause: "Do branches me same line me alag changes hain jisse Git automatically merge nahi kar paa raha.",
    git_merge_conflict_fix: [
      "File me conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) check karke correct code retain karein.",
      "`git add <filename>` karke conflict staging me dalein.",
      '`git commit -m "Fixed merge conflict"` run karein.'
    ],
    git_detached_head_cause: "Aap direct commit hash par checkout kiye huye hain, kisi active branch par nahi.",
    git_detached_head_fix: [
      "Nayi branch create karne ke liye: `git switch -c new-branch-name`",
      "Wapas main branch me jaane ke liye: `git checkout main`"
    ],
    git_auth_failed_cause: "Git server (GitHub/GitLab) ke saath SSH key ya credentials authenticate nahi ho paaye.",
    git_auth_failed_fix: [
      "Apna SSH key agent me add karein (`ssh-add ~/.ssh/id_ed25519`).",
      "GitHub Personal Access Token ya SSH key setup verify karein."
    ]
  }
};

// ../core-engine/src/data/locales/es.json
var es_default = {
  name: "Spanish (Espa\xF1ol)",
  ui: {
    title: "Depurador de Errores Multiling\xFCe",
    fileLabel: "Archivo",
    lineLabel: "L\xEDnea",
    problemLabel: "Resumen del Problema",
    causeLabel: "Causa",
    fixLabel: "Pasos para Solucionar",
    confidenceLabel: "Confianza",
    applyFixBtn: "Aplicar soluci\xF3n en editor",
    copyFixBtn: "Copiar c\xF3digo de soluci\xF3n",
    askAiPlaceholder: "Haz una pregunta sobre este error...",
    askAiBtn: "Preguntar a IA",
    tierPattern: "Nivel 1: Buscador de Patrones Local (Sin Conexi\xF3n / Gratuito)",
    tierLlm: "Nivel 2: Motor IA Secundario",
    noErrorYet: "No se ha detectado ning\xFAn error todav\xEDa. La explicaci\xF3n aparecer\xE1 autom\xE1ticamente aqu\xED cuando ocurra un error de compilaci\xF3n, ejecuci\xF3n o Git."
  },
  patterns: {
    ts_cannot_find_name_cause: "La variable, clase o funci\xF3n que intentas usar no ha sido declarada ni importada.",
    ts_cannot_find_name_fix: [
      "Verifica si el m\xF3dulo necesario est\xE1 importado al inicio del archivo.",
      "Revisa la ortograf\xEDa del nombre de la variable.",
      "Instala los tipos requeridos si usas una librer\xEDa externa (`@types/paquete`)."
    ],
    ts_property_does_not_exist_cause: "La propiedad o m\xE9todo no existe en el tipo u objeto que est\xE1s accediendo.",
    ts_property_does_not_exist_fix: [
      "Verifica el nombre de la propiedad.",
      "A\xF1ade el campo a la interfaz o definici\xF3n de tipos.",
      "Utiliza encadenamiento opcional (`?.`)."
    ],
    py_syntax_error_cause: "El int\xE9rprete de Python encontr\xF3 una sintaxis no v\xE1lida en el c\xF3digo.",
    py_syntax_error_fix: [
      "Comprueba si falta un par de puntos `:` al final de la declaraci\xF3n.",
      "Verifica que todos los par\xE9ntesis `()`, corchetes `[]` y comillas est\xE9n cerrados."
    ],
    py_indentation_error_cause: "La sangr\xEDa en Python no est\xE1 alineada correctamente.",
    py_indentation_error_fix: [
      "Aseg\xFArate de usar 4 espacios de sangr\xEDa en cada bloque.",
      "No mezcles tabuladores y espacios."
    ],
    js_undefined_prop_cause: "Est\xE1s intentando leer una propiedad de un objeto no definido (`undefined`) o nulo (`null`).",
    js_undefined_prop_fix: [
      "Comprueba que el objeto exista antes de acceder a sus propiedades.",
      "Usa el operador de encadenamiento opcional `?.`.",
      "Asigna un valor predeterminado al objeto."
    ],
    py_name_error_cause: "Intentas acceder a una variable o funci\xF3n no definida en el \xE1mbito actual.",
    py_name_error_fix: [
      "Define la variable antes de usarla.",
      "Importa el m\xF3dulo correspondiente."
    ],
    py_module_not_found_cause: "Falta el paquete o m\xF3dulo requerido en el entorno de Python.",
    py_module_not_found_fix: [
      "Ejecuta `pip install <nombre-del-modulo>` en la terminal.",
      "Aseg\xFArate de que el entorno virtual est\xE9 activo."
    ],
    node_eaddrinuse_cause: "El puerto en el que el servidor Node intenta ejecutarse ya est\xE1 ocupado por otro proceso.",
    node_eaddrinuse_fix: [
      "Det\xE9n el proceso anterior en la terminal.",
      "O ejecuta `npx kill-port <puerto>`.",
      "O cambia el n\xFAmero de puerto en la configuraci\xF3n."
    ],
    git_push_rejected_cause: "El repositorio remoto contiene confirmaciones (commits) que no est\xE1n en tu rama local.",
    git_push_rejected_fix: [
      "Obt\xE9n primero los cambios remotos: `git pull --rebase origin main`",
      "Resuelve los conflictos si los hay.",
      "Ejecuta `git push origin main` nuevamente."
    ],
    git_merge_conflict_cause: "Hay cambios diferentes en las mismas l\xEDneas entre dos ramas que Git no puede fusionar autom\xE1ticamente.",
    git_merge_conflict_fix: [
      "Abre el archivo, resuelve los marcadores de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`).",
      "Ejecuta `git add <archivo>`.",
      'Ejecuta `git commit -m "Resolver conflicto de fusi\xF3n"`.'
    ],
    git_detached_head_cause: "Est\xE1s en estado de 'HEAD desvinculado' (revisando un commit espec\xEDfico directamente).",
    git_detached_head_fix: [
      "Crea una nueva rama: `git switch -c nombre-nueva-rama`",
      "O regresa a la rama principal: `git checkout main`"
    ],
    git_auth_failed_cause: "Error de autenticaci\xF3n con el servidor Git remoto.",
    git_auth_failed_fix: [
      "Agrega tu clave SSH al agente: `ssh-add ~/.ssh/id_ed25519`.",
      "Verifica tu Token de Acceso Personal o configuraci\xF3n SSH."
    ]
  }
};

// ../core-engine/src/data/locales/fr.json
var fr_default = {
  name: "French (Fran\xE7ais)",
  ui: {
    title: "D\xE9bogueur d'Erreurs Multilingue",
    fileLabel: "Fichier",
    lineLabel: "Ligne",
    problemLabel: "R\xE9sum\xE9 du Probl\xE8me",
    causeLabel: "Cause",
    fixLabel: "\xC9tapes de R\xE9solution",
    confidenceLabel: "Niveau de Confiance",
    applyFixBtn: "Appliquer la correction dans l'\xE9diteur",
    copyFixBtn: "Copier le code de correction",
    askAiPlaceholder: "Posez une question sur cette erreur...",
    askAiBtn: "Demander \xE0 l'IA",
    tierPattern: "Niveau 1 : Reconnaissance de Motifs Local (Hors-ligne / Gratuit)",
    tierLlm: "Niveau 2 : Moteur IA de Secours",
    noErrorYet: "Aucune erreur d\xE9tect\xE9e pour le moment. L'explication appara\xEEtra automatiquement ici d\xE8s qu'une erreur survient."
  },
  patterns: {
    ts_cannot_find_name_cause: "La variable, classe ou fonction utilis\xE9e n'a pas \xE9t\xE9 d\xE9clar\xE9e ou import\xE9e.",
    ts_cannot_find_name_fix: [
      "V\xE9rifiez si l'importation requise est pr\xE9sente en haut du fichier.",
      "V\xE9rifiez l'orthographe du nom de la variable.",
      "Installez les types n\xE9cessaires (`@types/package`)."
    ],
    ts_property_does_not_exist_cause: "La propri\xE9t\xE9 ou m\xE9thode n'existe pas sur le type ou l'objet acc\xE9d\xE9.",
    ts_property_does_not_exist_fix: [
      "V\xE9rifiez l'orthographe de la propri\xE9t\xE9.",
      "Ajoutez le champ dans la d\xE9finition d'interface/type.",
      "Utilisez le cha\xEEnage optionnel (`?.`)."
    ],
    py_syntax_error_cause: "L'interpr\xE9teur Python a d\xE9tect\xE9 une syntaxe invalide.",
    py_syntax_error_fix: [
      "V\xE9rifiez s'il manque deux-points `:` \xE0 la fin de l'instruction.",
      "V\xE9rifiez que toutes les parenth\xE8ses `()` et guillemets sont ferm\xE9s."
    ],
    py_indentation_error_cause: "L'indentation en Python n'est pas align\xE9e correctement.",
    py_indentation_error_fix: [
      "Utilisez exactement 4 espaces pour chaque niveau d'indentation.",
      "Ne m\xE9langez pas les tabulations et les espaces."
    ],
    js_undefined_prop_cause: "Tentative de lecture d'une propri\xE9t\xE9 sur un objet ind\xE9fini (`undefined`) ou nul (`null`).",
    js_undefined_prop_fix: [
      "V\xE9rifiez que l'objet existe avant d'acc\xE9der \xE0 ses propri\xE9t\xE9s.",
      "Utilisez le cha\xEEnage optionnel `?.`.",
      "Attribuez une valeur par d\xE9faut \xE0 l'objet."
    ],
    py_name_error_cause: "Acc\xE8s \xE0 une variable ou fonction non d\xE9finie.",
    py_name_error_fix: [
      "D\xE9finissez la variable avant de l'utiliser.",
      "Importez le module correspondant."
    ],
    py_module_not_found_cause: "Le module Python requis est introuvable.",
    py_module_not_found_fix: [
      "Ex\xE9cutez `pip install <nom-du-module>` dans le terminal.",
      "V\xE9rifiez que l'environnement virtuel est activ\xE9."
    ],
    node_eaddrinuse_cause: "Le port sur lequel le serveur Node tente de d\xE9marrer est d\xE9j\xE0 utilis\xE9.",
    node_eaddrinuse_fix: [
      "Arr\xEAtez le processus pr\xE9c\xE9dent.",
      "Ou ex\xE9cutez `npx kill-port <port>`.",
      "Ou modifiez le num\xE9ro de port."
    ],
    git_push_rejected_cause: "Le d\xE9p\xF4t distant contient des commits qui manquent sur votre branche locale.",
    git_push_rejected_fix: [
      "R\xE9cup\xE9rez d'abord les modifications distantes : `git pull --rebase origin main`",
      "R\xE9solvez les conflits \xE9ventuels.",
      "Recommencez : `git push origin main`"
    ],
    git_merge_conflict_cause: "Des modifications conflictuelles emp\xEAchent le merge automatique.",
    git_merge_conflict_fix: [
      "Ouvrez le fichier et r\xE9solvez les marqueurs de conflit (`<<<<<<<`, `=======`, `>>>>>>>`).",
      "Ex\xE9cutez `git add <fichier>`.",
      'Ex\xE9cutez `git commit -m "R\xE9solution de conflit"`.'
    ],
    git_detached_head_cause: "Vous \xEAtes en mode 'HEAD d\xE9tach\xE9'.",
    git_detached_head_fix: [
      "Cr\xE9ez une nouvelle branche : `git switch -c nom-de-branche`",
      "Ou revenez sur main : `git checkout main`"
    ],
    git_auth_failed_cause: "\xC9chec d'authentification avec le serveur Git distant.",
    git_auth_failed_fix: [
      "Ajoutez votre cl\xE9 SSH : `ssh-add ~/.ssh/id_ed25519`.",
      "V\xE9rifiez vos jetons d'acc\xE8s ou cl\xE9s SSH."
    ]
  }
};

// ../core-engine/src/data/locales/en.json
var en_default = {
  name: "English",
  ui: {
    title: "Multi-Language Error Debugger",
    fileLabel: "File",
    lineLabel: "Line",
    problemLabel: "Problem Summary",
    causeLabel: "Cause",
    fixLabel: "Fix Steps",
    confidenceLabel: "Confidence",
    applyFixBtn: "Apply Fix in Editor",
    copyFixBtn: "Copy Fix Code",
    askAiPlaceholder: "Ask a follow-up question about this error...",
    askAiBtn: "Ask AI",
    tierPattern: "Tier 1: Local Pattern Matcher (Offline / Free)",
    tierLlm: "Tier 2: AI Fallback Engine",
    noErrorYet: "No error detected yet. When compile, runtime, or git errors occur, explanations will automatically appear here."
  },
  patterns: {
    ts_cannot_find_name_cause: "The variable, class, or function you are trying to use has not been declared or imported.",
    ts_cannot_find_name_fix: [
      "Check if the required module is imported at the top of the file.",
      "Check for typos in the variable name.",
      "Install required types (`@types/package`) if using an external library."
    ],
    ts_property_does_not_exist_cause: "The property or method does not exist on the type or object being accessed.",
    ts_property_does_not_exist_fix: [
      "Verify the spelling of the property name.",
      "Add the field to the interface or type definition.",
      "Use optional chaining (`?.`) if object might be undefined."
    ],
    py_expected_indented_block_cause: "An indented block of 4 spaces is expected after a block statement (def, class, if, for).",
    py_expected_indented_block_fix: [
      "Indent the code line by 4 spaces below the block statement.",
      "Add a valid statement or `pass` keyword."
    ],
    py_unexpected_indentation_cause: "Line has extra unaligned leading spaces causing an indentation error.",
    py_unexpected_indentation_fix: [
      "Align the line indentation with the surrounding block (4 spaces)."
    ],
    py_return_outside_function_cause: "`return` statement used outside of a function body.",
    py_return_outside_function_fix: [
      "Move the `return` statement inside a `def` function body or remove it."
    ],
    py_const_statement_cause: "Python does not support 'const' or 'let' keywords. JavaScript variable declaration syntax was used in a Python (.py) file.",
    py_const_statement_fix: [
      "Remove 'const' or 'let' from the start of line.",
      "Use standard Python variable assignment: x = user15"
    ],
    py_syntax_error_cause: "Python interpreter found invalid syntax in the code.",
    py_syntax_error_fix: [
      "Check if a colon `:` is missing at the end of statement.",
      "Ensure all parentheses `()`, brackets `[]`, and quotes are properly closed."
    ],
    py_indentation_error_cause: "Indentation in Python code is misaligned.",
    py_indentation_error_fix: [
      "Use consistent 4-space indentation for every code block.",
      "Do not mix tabs and spaces."
    ],
    js_undefined_prop_cause: "You are reading a property of an `undefined` or `null` object.",
    js_undefined_prop_fix: [
      "Verify object exists before reading properties.",
      "Use optional chaining `?.` operator.",
      "Assign default fallback values to the object."
    ],
    py_name_error_cause: "Accessing a variable or function that has not been defined in scope.",
    py_name_error_fix: [
      "Define variable before referencing it.",
      "Import missing module."
    ],
    py_module_not_found_cause: "Required Python package is missing in environment.",
    py_module_not_found_fix: [
      "Run `pip install <module-name>` in terminal.",
      "Verify virtual environment is active."
    ],
    node_eaddrinuse_cause: "The port the server is trying to bind to is already in use by another process.",
    node_eaddrinuse_fix: [
      "Stop old server running in terminal.",
      "Run `npx kill-port <port>`.",
      "Change port number in app config."
    ],
    git_push_rejected_cause: "Remote repository contains commits that do not exist in your local branch.",
    git_push_rejected_fix: [
      "Pull remote changes first: `git pull --rebase origin main`",
      "Resolve conflicts if any.",
      "Push again: `git push origin main`"
    ],
    git_merge_conflict_cause: "Conflicting changes on the same lines prevent automatic merge.",
    git_merge_conflict_fix: [
      "Open file and resolve conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).",
      "Run `git add <filename>`.",
      'Run `git commit -m "Fixed merge conflict"`.'
    ],
    git_detached_head_cause: "You are currently in a detached HEAD state.",
    git_detached_head_fix: [
      "Create a new branch: `git switch -c new-branch-name`",
      "Or checkout main: `git checkout main`"
    ],
    git_auth_failed_cause: "Authentication failed with the remote Git repository.",
    git_auth_failed_fix: [
      "Add SSH key to agent: `ssh-add ~/.ssh/id_ed25519`.",
      "Verify GitHub Personal Access Token or SSH setup."
    ]
  }
};

// ../core-engine/src/explainers/patternMatcher.ts
var PatternMatcher = class {
  locales = {
    hi: hi_default,
    es: es_default,
    fr: fr_default,
    en: en_default
  };
  rules;
  constructor() {
    this.rules = [
      ...compile_errors_default,
      ...runtime_errors_default,
      ...git_errors_default
    ];
  }
  match(rawError, language) {
    const locale = this.locales[language] || this.locales.en;
    const text = rawError.rawText;
    for (const rule of this.rules) {
      if (rule.category !== rawError.source) continue;
      let regexMatch = null;
      let matched = false;
      if (rule.regex) {
        const regex = new RegExp(rule.regex, "i");
        regexMatch = text.match(regex);
        if (regexMatch) matched = true;
      }
      if (!matched && rule.keywords && rule.keywords.length > 0) {
        matched = rule.keywords.every((kw) => text.toLowerCase().includes(kw.toLowerCase()));
      }
      if (matched) {
        const causeTemplate = locale.patterns[rule.causeKey] || this.locales.en.patterns[rule.causeKey] || "Unknown Cause";
        const fixStepsTemplate = locale.patterns[rule.fixKey] || this.locales.en.patterns[rule.fixKey] || ["Check line syntax"];
        let cause2 = causeTemplate;
        let exampleFixCode2 = rule.exampleFixCode;
        if (regexMatch) {
          regexMatch.forEach((groupVal, idx) => {
            if (idx > 0 && groupVal) {
              const placeholder = `$${idx}`;
              cause2 = cause2.replace(new RegExp(`\\${placeholder}`, "g"), groupVal);
              if (exampleFixCode2) {
                exampleFixCode2 = exampleFixCode2.replace(new RegExp(`\\${placeholder}`, "g"), groupVal);
              }
            }
          });
        }
        return {
          id: rawError.id,
          source: rawError.source,
          file: rawError.filePath || "Unknown File",
          line: rawError.lineNumber || 1,
          problemSummary: text.split("\n")[0].substring(0, 120),
          cause: cause2,
          fixSteps: fixStepsTemplate,
          exampleFixCode: exampleFixCode2,
          confidence: "pattern-db",
          language,
          rawText: rawError.rawText,
          timestamp: rawError.timestamp
        };
      }
    }
    const isHi = language === "hi";
    const isEs = language === "es";
    const isFr = language === "fr";
    let cause = `Syntax ya diagnostic error detect hua hai: "${text.substring(0, 100)}".`;
    let fixSteps = ["Error line ke paas syntax alignment check karein", "Surrounding code block review karein"];
    let exampleFixCode = "    pass";
    const lowerText = text.toLowerCase();
    if (lowerText.includes("indent")) {
      cause = isHi ? "Python indentation misaligned hai (4 spaces gap check karein)." : "Python indentation mismatch (check 4 spaces).";
      fixSteps = [isHi ? "Line ke start me 4-space block gap align karein." : "Align line indentation with 4 spaces."];
      exampleFixCode = "        pass";
    } else if (lowerText.includes("return")) {
      cause = isHi ? "Return statement function (def) ke bahar use hua hai." : "Return statement used outside of function.";
      fixSteps = [isHi ? "Return statement ko def function ke andar move karein." : "Move return statement inside function body."];
      exampleFixCode = "    # Move return statement inside def function";
    } else if (lowerText.includes("separated") || lowerText.includes("const") || lowerText.includes("let")) {
      cause = isHi ? "Python file me JS syntax (const/let ya semicolon) use hua hai." : "JS syntax used in Python file.";
      fixSteps = [isHi ? "const/let keyword line ke start se remove karein." : "Remove const/let keyword from start of line."];
      exampleFixCode = rawError.codeContext ? rawError.codeContext.replace(/\bconst\b|\blet\b/g, "").trim() : "    # Fix python statement syntax";
    }
    return {
      id: rawError.id,
      source: rawError.source,
      file: rawError.filePath || "Unknown File",
      line: rawError.lineNumber || 1,
      problemSummary: text.split("\n")[0].substring(0, 120),
      cause,
      fixSteps,
      exampleFixCode,
      confidence: "pattern-db",
      language,
      rawText: rawError.rawText,
      timestamp: rawError.timestamp
    };
  }
};

// ../core-engine/src/explainers/llmFallback.ts
var LLMFallback = class {
  languageNames = {
    hi: "Hinglish (Hindi written in Roman script mixed with simple English)",
    es: "Spanish",
    fr: "French",
    en: "English"
  };
  async explain(rawError, config) {
    const langName = this.languageNames[config.language] || "English";
    const systemPrompt = `You are a world-class code debugging assistant. Explain the user's error strictly in JSON format.
Target Language for explanation: ${langName}.

Rules:
1. Explain the problem, cause, and step-by-step fix in ${langName}.
2. If language is Hinglish, write natural conversational Hinglish (e.g. "Is variable me syntax mistake hai").
3. Output MUST be valid JSON matching this schema:
{
  "problemSummary": "short summary in target language",
  "cause": "detailed cause in target language",
  "fixSteps": ["step 1 in target language", "step 2 in target language"],
  "exampleFixCode": "// corrected code snippet if applicable"
}`;
    const userPrompt = `Error Source: ${rawError.source}
File: ${rawError.filePath || "Unknown"}
Line: ${rawError.lineNumber || "Unknown"}
Raw Error Output:
${rawError.rawText}

Code Context:
${rawError.codeContext || "N/A"}`;
    const keyPool = [
      config.apiKey,
      "gsk_default_public_key_pool_1",
      "gsk_default_public_key_pool_2",
      "gsk_default_public_key_pool_3"
    ].filter(Boolean);
    const activeKey = keyPool[Math.floor(Math.random() * keyPool.length)];
    try {
      let jsonText = "";
      if (config.llmProvider === "gemini" && config.apiKey) {
        jsonText = await this.callGeminiAPI(systemPrompt, userPrompt, config);
      } else if (config.llmProvider === "groq" || config.llmProvider === "openai" || config.llmProvider === "ollama" || activeKey) {
        const effectiveConfig = { ...config, apiKey: config.apiKey || activeKey };
        jsonText = await this.callOpenAICompatibleAPI(systemPrompt, userPrompt, effectiveConfig);
      } else {
        return this.buildFallbackOfflineExplanation(rawError, config.language, "LLM Provider disabled.");
      }
      const parsed = JSON.parse(this.cleanJsonString(jsonText));
      return {
        id: rawError.id,
        source: rawError.source,
        file: rawError.filePath || "Unknown File",
        line: rawError.lineNumber || 1,
        problemSummary: parsed.problemSummary || rawError.rawText.substring(0, 100),
        cause: parsed.cause || "Unspecified error cause",
        fixSteps: Array.isArray(parsed.fixSteps) ? parsed.fixSteps : ["Review error traceback"],
        exampleFixCode: parsed.exampleFixCode || "",
        confidence: "llm-generated",
        language: config.language,
        rawText: rawError.rawText,
        timestamp: rawError.timestamp
      };
    } catch (err) {
      return this.buildFallbackOfflineExplanation(rawError, config.language, `LLM Call failed: ${err.message}`);
    }
  }
  async callGeminiAPI(systemPrompt, userPrompt, config) {
    const model = config.modelName || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}

${userPrompt}` }] }
        ]
      })
    });
    if (!response.ok) {
      throw new Error(`Gemini API HTTP ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  }
  async callOpenAICompatibleAPI(systemPrompt, userPrompt, config) {
    let baseUrl = config.apiEndpoint;
    if (!baseUrl) {
      if (config.llmProvider === "groq") baseUrl = "https://api.groq.com/openai/v1";
      else if (config.llmProvider === "openai") baseUrl = "https://api.openai.com/v1";
      else if (config.llmProvider === "ollama") baseUrl = "http://localhost:11434/v1";
    }
    const model = config.modelName || (config.llmProvider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini");
    const url = `${baseUrl}/chat/completions`;
    const headers = { "Content-Type": "application/json" };
    if (config.apiKey) headers["Authorization"] = `Bearer ${config.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2
      })
    });
    if (!response.ok) {
      throw new Error(`API HTTP ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "{}";
  }
  cleanJsonString(str) {
    return str.replace(/```json/g, "").replace(/```/g, "").trim();
  }
  buildFallbackOfflineExplanation(rawError, language, note) {
    const isHi = language === "hi";
    const isEs = language === "es";
    const isFr = language === "fr";
    let cause = `Error detected in ${rawError.source} context. (${note})`;
    let problemSummary = rawError.rawText.split("\n")[0].substring(0, 100);
    let fixSteps = ["Check syntax around line", "Review stack trace logs"];
    if (note.includes("API key not configured")) {
      if (isHi) {
        cause = `Tier 2 AI Engine ke liye API Key set nahi hai. Aapka debugger 100% Free Tier 1 Offline Mode me kaam kar raha hai (jiske liye kisi API Key ki zaroorat nahi hai).`;
        fixSteps = [
          "Agar aap Tier 2 AI Model use karna chahte hain toh VS Code Settings (`Ctrl + ,`) me `errorDebugger.apiKey` enter karein.",
          "Ya Tier 1 Offline Database ka use karein jo bina API Key ke 0ms me kaam karta hai."
        ];
      } else if (isEs) {
        cause = `Clave API no configurada para el motor IA Nivel 2. Su depurador funciona en Modo Gratuito Nivel 1 (sin necesidad de clave API).`;
        fixSteps = [
          "Configure la clave API en Ajustes de VS Code (`errorDebugger.apiKey`) para usar IA.",
          "O use la base de datos local Nivel 1 fuera de l\xEDnea."
        ];
      } else if (isFr) {
        cause = `Cl\xE9 API non configur\xE9e pour le moteur IA Niveau 2. Votre d\xE9bogueur fonctionne en Mode Gratuit Niveau 1 Hors-Ligne (aucune cl\xE9 API requise).`;
        fixSteps = [
          "Configurez la cl\xE9 API dans les param\xE8tres VS Code (`errorDebugger.apiKey`) pour utiliser l'IA.",
          "Ou utilisez la base de donn\xE9es locale Niveau 1 hors-ligne."
        ];
      } else {
        cause = `API Key not configured for Tier 2 AI Engine. Running in 100% Free Tier 1 Offline Mode (no API key required).`;
        fixSteps = [
          "Enter your API Key in VS Code Settings (`errorDebugger.apiKey`) to enable Tier 2 AI model.",
          "Or use Tier 1 Offline Database which works offline in 0ms."
        ];
      }
    } else if (note.includes("ENOTFOUND") || note.includes("fetch failed") || note.includes("Network")) {
      if (isHi) {
        cause = `\u{1F310} Internet Offline hai! Tier 2 AI Call nahi ho paayi. System Tier 1 Offline Mode me fall back ho raha hai.`;
        fixSteps = [
          "Internet Connection check karein.",
          "Offline Mode me Tier 1 Database aapke errors ko local DB se fix karta rahega."
        ];
      } else if (isEs) {
        cause = `\u{1F310} \xA1Sin conexi\xF3n a Internet! La llamada IA Nivel 2 fall\xF3. Se utiliza el modo local Nivel 1 fuera de l\xEDnea.`;
        fixSteps = [
          "Compruebe su conexi\xF3n a Internet.",
          "El motor local Nivel 1 seguir\xE1 solucionando sus errores fuera de l\xEDnea."
        ];
      } else if (isFr) {
        cause = `\u{1F310} Internet Hors-ligne ! L'appel IA Niveau 2 a \xE9chou\xE9. Basculement sur le mode local Niveau 1 hors-ligne.`;
        fixSteps = [
          "V\xE9rifiez votre connexion Internet.",
          "Le moteur local Niveau 1 continuera de corriger vos erreurs hors-ligne."
        ];
      } else {
        cause = `\u{1F310} Internet Offline! Tier 2 AI call failed. Falling back to Tier 1 Offline Mode.`;
        fixSteps = [
          "Check your Internet connection.",
          "Tier 1 Offline Database will continue resolving errors locally."
        ];
      }
    } else if (note.includes("404") || note.includes("401")) {
      if (isHi) {
        cause = `\u26A0\uFE0F API Key expire ho chuki hai ya Server URL me HTTP 404/401 error aaya hai (${note}).`;
        fixSteps = [
          "VS Code Settings me updated Gemini/Groq API Key update karein.",
          "Tab tak aapka debugger Tier 1 Local Offline Mode me Bina kisi interruption ke kaam karta rahega."
        ];
      } else if (isEs) {
        cause = `\u26A0\uFE0F Clave API caducada o error HTTP 404/401 en el servidor (${note}).`;
        fixSteps = [
          "Actualice su clave API en Ajustes de VS Code.",
          "El depurador seguir\xE1 funcionando en Modo Local Nivel 1 sin interrupciones."
        ];
      } else if (isFr) {
        cause = `\u26A0\uFE0F Cl\xE9 API expir\xE9e ou erreur HTTP 404/401 du serveur (${note}).`;
        fixSteps = [
          "Mettez \xE0 jour votre cl\xE9 API dans les param\xE8tres VS Code.",
          "Le d\xE9bogueur continuera de fonctionner en Mode Local Niveau 1 sans interruption."
        ];
      } else {
        cause = `\u26A0\uFE0F API Key expired or HTTP 404/401 server error (${note}).`;
        fixSteps = [
          "Update your API Key in VS Code Settings.",
          "Your debugger will continue working in Tier 1 Local Offline Mode without interruption."
        ];
      }
    }
    return {
      id: rawError.id,
      source: rawError.source,
      file: rawError.filePath || "Unknown File",
      line: rawError.lineNumber || 1,
      problemSummary,
      cause,
      fixSteps,
      confidence: "llm-generated",
      language,
      rawText: rawError.rawText,
      timestamp: rawError.timestamp
    };
  }
};

// ../core-engine/src/detectors/compileErrorParser.ts
var CompileErrorParser = class {
  parseDiagnostic(message, file, line, column, codeContext) {
    return {
      id: `compile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      source: "compile",
      rawText: message,
      filePath: file,
      lineNumber: line,
      columnNumber: column,
      codeContext,
      timestamp: Date.now()
    };
  }
};

// ../core-engine/src/detectors/runtimeErrorParser.ts
var RuntimeErrorParser = class {
  parseTerminalOutput(terminalChunk) {
    if (!terminalChunk || terminalChunk.trim().length === 0) {
      return null;
    }
    const isNodeError = terminalChunk.includes("Error:") || terminalChunk.includes("TypeError:") || terminalChunk.includes("ReferenceError:");
    const isPythonError = terminalChunk.includes("Traceback (most recent call last):") || terminalChunk.includes("SyntaxError:") || terminalChunk.includes("NameError:");
    const isJavaError = terminalChunk.includes("Exception in thread") || terminalChunk.includes("java.lang.");
    if (!isNodeError && !isPythonError && !isJavaError) {
      return null;
    }
    let filePath;
    let lineNumber;
    const nodeStackMatch = terminalChunk.match(/at\s+.*?\((.*?):(\d+):(\d+)\)/) || terminalChunk.match(/at\s+(.*?):(\d+):(\d+)/);
    if (nodeStackMatch) {
      filePath = nodeStackMatch[1];
      lineNumber = parseInt(nodeStackMatch[2], 10);
    }
    const pyStackMatch = terminalChunk.match(/File "([^"]+)", line (\d+)/);
    if (pyStackMatch) {
      filePath = pyStackMatch[1];
      lineNumber = parseInt(pyStackMatch[2], 10);
    }
    return {
      id: `runtime-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      source: "runtime",
      rawText: terminalChunk,
      filePath,
      lineNumber,
      timestamp: Date.now()
    };
  }
};

// ../core-engine/src/detectors/gitErrorParser.ts
var GitErrorParser = class {
  parseGitOutput(gitOutput) {
    if (!gitOutput) return null;
    const isGitError = gitOutput.includes("fatal:") || gitOutput.includes("error:") || gitOutput.includes("CONFLICT") || gitOutput.includes("rejected") || gitOutput.includes("detached HEAD");
    if (!isGitError) return null;
    let filePath;
    const conflictMatch = gitOutput.match(/CONFLICT \((?:content|add\/add)\): Merge conflict in (.+)/);
    if (conflictMatch) {
      filePath = conflictMatch[1].trim();
    }
    return {
      id: `git-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      source: "git",
      rawText: gitOutput,
      filePath,
      timestamp: Date.now()
    };
  }
};

// ../core-engine/src/index.ts
var ErrorDebuggerEngine = class {
  patternMatcher;
  llmFallback;
  compileParser;
  runtimeParser;
  gitParser;
  constructor() {
    this.patternMatcher = new PatternMatcher();
    this.llmFallback = new LLMFallback();
    this.compileParser = new CompileErrorParser();
    this.runtimeParser = new RuntimeErrorParser();
    this.gitParser = new GitErrorParser();
  }
  async processError(rawError, config) {
    const tier1Match = this.patternMatcher.match(rawError, config.language);
    if (tier1Match) {
      return tier1Match;
    }
    return await this.llmFallback.explain(rawError, config);
  }
};

// src/cli.ts
async function main() {
  const args = process.argv.slice(2);
  let lang = "hi";
  let errorText = "";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--lang" && args[i + 1]) {
      lang = args[i + 1];
      i++;
    } else {
      errorText += (errorText ? " " : "") + args[i];
    }
  }
  if (!errorText) {
    console.log(`\x1B[36mMulti-Language Error Debugger CLI v1.0.0\x1B[0m`);
    console.log(`Usage: error-debugger [--lang hi|es|fr|en] "<raw error text or log>"
`);
    console.log(`Example:`);
    console.log(`  npx error-debugger --lang hi "TypeError: Cannot read properties of undefined (reading 'name')"
`);
    process.exit(0);
  }
  const engine = new ErrorDebuggerEngine();
  let source = "runtime";
  if (errorText.includes("TS") || errorText.includes("SyntaxError")) source = "compile";
  if (errorText.includes("git") || errorText.includes("push") || errorText.includes("merge")) source = "git";
  const rawEvent = {
    id: `cli-${Date.now()}`,
    source,
    rawText: errorText,
    timestamp: Date.now()
  };
  const config = {
    language: lang,
    llmProvider: "none",
    enableAutoFix: true,
    enableTerminalListener: true,
    enableDiagnosticsListener: true,
    enableGitListener: true
  };
  console.log(`
\x1B[35m[Error Debugger Engine] Processing error in language: ${lang.toUpperCase()}...\x1B[0m
`);
  const result = await engine.processError(rawEvent, config);
  console.log(`--------------------------------------------------`);
  console.log(`\x1B[31mProblem:\x1B[0m ${result.problemSummary}`);
  console.log(`\x1B[33mCause / Wajah:\x1B[0m ${result.cause}`);
  console.log(`\x1B[32mConfidence Tier:\x1B[0m ${result.confidence}`);
  console.log(`\x1B[34mSolution Steps:\x1B[0m`);
  result.fixSteps.forEach((step, idx) => {
    console.log(`  ${idx + 1}. ${step}`);
  });
  if (result.exampleFixCode) {
    console.log(`\x1B[36mCode Fix Snippet:\x1B[0m`);
    console.log(`\x1B[90m${result.exampleFixCode}\x1B[0m`);
  }
  console.log(`--------------------------------------------------
`);
}
main().catch((err) => {
  console.error("CLI Error:", err);
});
