CREATE TABLE USUARIO (
    UsuarioId           NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre              VARCHAR2(100)  NOT NULL,
    CorreoInstitucional VARCHAR2(150)  NOT NULL UNIQUE,
    CorreoVerificado    NUMBER(1)      DEFAULT 0 NOT NULL, -- 0 = false, 1 = true
    CONSTRAINT chk_correo_institucional
        CHECK (CorreoInstitucional LIKE '%@universitariadecolombia.edu.co')
);
