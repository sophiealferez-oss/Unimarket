CREATE TABLE USUARIO (
    UsuarioId           NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre              VARCHAR2(100)  NOT NULL,
    CorreoInstitucional VARCHAR2(150)  NOT NULL UNIQUE,
    CorreoVerificado    NUMBER(1)      DEFAULT 0 NOT NULL, -- 0 = false, 1 = true
    CONSTRAINT chk_correo_institucional
        CHECK (CorreoInstitucional LIKE '%@universitariadecolombia.edu.co')
);

--PARTE TABLA ANDRES 
CREATE TABLE CODIGO_VERIFICACION(CodigoId NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
UsuarioId INT NOT NULL, Codigomail VARCHAR(50) NOT NULL, Fecha_Expiracion DATE NOT NULL, Usado NUMBER (1) DEFAULT 0 NOT NULL,

CONSTRAINT FK_CODIGO_VERIFICACION
FOREIGN KEY (UsuarioId) REFERENCES USUARIO(UsuarioId));

--Parte Johan
CREATE TABLE TIPOCATEGORIA(TipoCategoriaID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,NOMBRE VARCHAR2(100)  NOT NULL);


--///////////////////////////////////////////////////////////////////