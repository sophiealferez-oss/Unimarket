CREATE TABLE PRODUCTO (
    ProductoId          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    VendedorId          NUMBER NOT NULL,
    TipoCategoria       NUMBER NOT NULL,
    Nombre              VARCHAR2(100)  NOT NULL,
    Descripcion         VARCHAR2(100)  NOT NULL,
    Precio              NUMBER NOT NULL,
    Imagen              VARCHAR2(500),
    Estado              VARCHAR2(20) DEFAULT 'disponible' NOT NULL,


    FechaPublicacion DATE DEFAULT SYSDATE,
    CONSTRAINT fk_producto_vendedor
    FOREIGN KEY (VendedorId)
    REFERENCES USUARIO(UsuarioId)
    ) ;



