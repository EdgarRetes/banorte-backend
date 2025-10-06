-- Migration: Create Audit Triggers
-- Ejecutar: npx prisma migrate dev --name add_audit_triggers

-- ==============================================
-- FUNCIÓN GENÉRICA PARA AUDITORÍA
-- ==============================================
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id INTEGER;
BEGIN
    -- Intentar obtener el user_id del contexto de la sesión
    -- (esto se puede configurar desde la aplicación)
    BEGIN
        current_user_id := current_setting('app.current_user_id')::INTEGER;
    EXCEPTION WHEN OTHERS THEN
        current_user_id := NULL;
    END;

    -- INSERT
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO "AuditLog" ("entityName", "recordId", "action", "before", "after", "userId", "createdAt")
        VALUES (TG_TABLE_NAME, NEW.id, 'CREATE', NULL, row_to_json(NEW), current_user_id, NOW());
        RETURN NEW;
    
    -- UPDATE
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO "AuditLog" ("entityName", "recordId", "action", "before", "after", "userId", "createdAt")
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), current_user_id, NOW());
        RETURN NEW;
    
    -- DELETE
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO "AuditLog" ("entityName", "recordId", "action", "before", "after", "userId", "createdAt")
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), NULL, current_user_id, NOW());
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- TRIGGERS PARA User
-- ==============================================
DROP TRIGGER IF EXISTS user_audit_trigger ON "User";
CREATE TRIGGER user_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();

-- ==============================================
-- TRIGGERS PARA BusinessRule
-- ==============================================
DROP TRIGGER IF EXISTS business_rule_audit_trigger ON "BusinessRule";
CREATE TRIGGER business_rule_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "BusinessRule"
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();

-- ==============================================
-- TRIGGERS PARA Role
-- ==============================================
DROP TRIGGER IF EXISTS role_audit_trigger ON "Role";
CREATE TRIGGER role_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "Role"
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();

-- ==============================================
-- TRIGGERS PARA RolePrivilege
-- ==============================================
DROP TRIGGER IF EXISTS role_privilege_audit_trigger ON "RolePrivilege";
CREATE TRIGGER role_privilege_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "RolePrivilege"
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();